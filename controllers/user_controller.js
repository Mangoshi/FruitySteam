const User = require('../models/user_schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Game = require("../models/game_schema");

// Register a user //
const registerUser = (req, res) => {
    // Assign newUser to a new User Object from user_schema, using the request body
    let newUser = new User(req.body)
    // Use bcrypt to hash the password. hashSync(password, salt)
    newUser.password = bcrypt.hashSync(req.body.password, 10)
    // Save the new user to the DB
    newUser.save((error, user) => {
        // If there is an error, respond with status 400 and send error back
        if(error){
            // Error code 11000 = DuplicateKey in this case
            if(error.code === 11000) {
                // If error's keyPattern is email, return email, if not, return username
                let keyPattern = error.keyPattern.email ? 'email' : 'username'
                // Return a status 400 with an error message and the error data
                return res.status(400).json({
                    "message": `That ${keyPattern} already exists! No duplicates allowed.`,
                    "error": error
                });
            }
            else {
                console.error(error);
                return res.status(500).json(error);
            }
        }
        // Else if successful
        else {
            // remove hashed password before responding to the client
            user.password = undefined
            // Return the new user to the client
            return res.json({
                msg: `Successfully registered ${user.username}!`,
                data: user
            })
        }
    })
}

// Login a user //
const loginUser = (req, res) => {
    // Connect to DB, and find the user that has...
    User.findOne({
        // ...an email matching the email in the request body
        email: req.body.email,
    }) // Then...
        .then(user => {
            // ...if user is invalid, OR if comparePassword from user_schema fails
            if(!user || !user.comparePassword(req.body.password)){
                // Respond with a status 401: Unauthorised & an error message
                return res.status(401).json({
                    message: 'Authentication failed: Invalid credentials.'
                })
            }
            // Respond with a token
            res.json({
                // Sign the token with jsonwebtoken using a payload of username, email, role & id,
                // using 'steamedFruit' as our secret-key.
                token: jwt.sign({
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    _id: user._id
                }, 'steamedFruit', {
                    // Setting token expiry to 30 days
                    expiresIn: '30d'
                }),
                role: user.role
            })
        })
        // If an error occurs, catch & throw the error
        .catch(error => {
            throw error
        })
}

// Read all users (with optional filters) //
const readUsers = (req, res) => {

    let limit = req.query.limit
    // Default: createdAt
    let sortBy = req.query.sort ? req.query.sort : 'createdAt'
    // Default: Descending
    let direction = req.query.direction ? req.query.direction : -1
    // Default: 1
    let page = req.query.page ? req.query.page : 1

    // Initialising filter variables
    let searchBy
    let searchQuery

    // Only if both type and search queries exist at once will they be assigned
    if(req.query.by && req.query.query){
        searchBy = req.query.by
        searchQuery = req.query.query
    }

    searchQuery = {$regex: '.*' + searchQuery + '.*', $options: 'i'}

    // Find all users by default, or optionally define:
    // - Property to search by + search query,
    // - Property to sort by + direction (asc/desc),
    // - Amount of users to return (limit)
    User
        .find({[searchBy]:searchQuery})
        .sort([[sortBy, direction]])
        .limit(limit)
        .skip(limit * (page - 1))
        // Rather than just returning an array of ObjectIDs,
        // Populate the response wishlist array with the actual data, from the Game collection
        .populate("wishlist")
        .then(async (data) => {
            data[0].password = undefined
            console.log(data);
            if (data.length > 0) {
                let countQuery = await User.countDocuments({[searchBy]: searchQuery})
                res.status(200).json({
                    "msg": limit ? `${limit} users retrieved` : `All users retrieved`,
                    "total": `${countQuery} user(s) match your query`,
                    "data": data
                });
                console.log(limit ? `First ${limit} users retrieved` : 'All users retrieved', `\nSorted by: ${sortBy} \nDirection: ${direction}`);
            } else {
                res.status(404).json({
                    "msg": "No users found",
                    "data": data
                });
                console.log("No users found");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

// Read one user by _id //
const readUser = (req, res) => {

    let id = req.params.id
    console.log(id)

    User.find({'_id':id})
        // Rather than just returning an array of ObjectIDs,
        // Populate the response wishlist array with the actual data, from the Game collection
        .populate("wishlist")
        .then((data) => {
            data[0].password = undefined
            console.log(data);
            if(data.length > 0){
                res.status(200).json({
                    "msg" : `User ${id} retrieved`,
                    "data": data
                });
                console.log(`User ${id} retrieved`);
            }
            else{
                res.status(404).json({
                    "msg" : "No user found (you may not be authorized)",
                    "data": data
                });
                console.log("No user found");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

// Update a user by MongoDB _id //
const updateUserByID = (req, res) => {
    let id = req.params.id;
    let body = req.body;

    // If the user tries to update their password
    if(body.password){
        // Use bcrypt to re-hash the password. hashSync(password, salt)
        body.password = bcrypt.hashSync(req.body.password, 10)
    }

    User.findByIdAndUpdate(id, body, {
        _id: id,
        new: true
    })
        .then((data) => {
            console.log(data)
            if(data){
                data.password = undefined
                res.status(201).json({
                    msg: `Successfully updated ${data.username}!`,
                    data: data
                });
                console.log(data, 'User Updated!');
            }
            else {
                res.status(404).json({"message": `User with _id: ${id} not found`});
                console.log('User Not Updated!');
            }

        })
        .catch((err) => {
            if(err.name === 'ValidationError'){
                console.error('Validation Error!!', err);
                res.status(422).json({
                    "msg": "Validation Error",
                    "error" : err.message
                });
            }
            else if(err.name === 'CastError') {
                res.status(400).json({
                    "message": `Bad request, either ${id} is not a valid _id, or you tried to update your wishlist with an invalid _id`,
                    "wishlist": body.wishlist
                });
            }
            else if(err.codeName === 'DuplicateKey') {
                res.status(400).json({
                    "message": `The email address ${err.keyValue.email} already exists! No duplicate emails allowed.`,
                    "error": err
                });
            }
            else {
                console.error(err);
                res.status(500).json(err);
            }
        });
};

// Delete a user by MongoDB _id //
const deleteUserByID = (req, res) => {

    let id = req.params.id;

    User.findByIdAndDelete({ _id : id })
        .then((data) => {

            if(data){
                res.status(200).json({
                    "message": `User with _id: ${id} deleted successfully`
                });
                console.log("User Deleted!")
            }
            else {
                res.status(404).json({
                    "message": `User with _id: ${id} not found`
                });
                console.log("User Not Deleted!")
            }

        })
        .catch((err) => {
            console.error(err);
            if(err.name === 'CastError') {
                res.status(400).json({
                    "message": `Bad request, ${id} is not a valid _id`
                });
            }
            else {
                res.status(500).json(err)
            }
        });
};

// Export user controller functions
module.exports = {
    registerUser,
    loginUser,
    readUsers,
    readUser,
    updateUserByID,
    deleteUserByID,
};


