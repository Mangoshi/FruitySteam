const User = require('../models/user_schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = (req, res) => {
    // assign newUser to a new User Object from user_schema, using the request body
    let newUser = new User(req.body)
    // use bcrypt to hash the password. hashSync(password, salt)
    newUser.password = bcrypt.hashSync(req.body.password, 10)
    // save the new user to the DB
    newUser.save((error, user) => {
        // if there is an error, respond with status 400 and send error back
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
        // else if successful
        else {
            // remove hashed password before responding to the client
            user.password = undefined
            // return the new user to the client
            return res.json({
                msg: `Successfully registered ${user.username}!`,
                data: user
            })
        }
    })
}

const loginUser = (req, res) => {
    // Connect to DB, and find the user that has...
    User.findOne({
        // ...an email matching the email in the request body
        email: req.body.email,
    }) // Then...
        .then(user => {
            // ... if user is invalid, OR if comparePassword from user_schema fails
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
                })
            })
        })
        // If an error occurs, catch & throw the error
        .catch(error => {
            throw error
        })
}

const readUsers = (req, res) => {

    let limit = req.query.limit
    // Default: username
    let sortBy = req.query.sort ? req.query.sort : 'username'
    // Default: Ascending
    let direction = req.query.direction ? req.query.direction : 1

    // Initialising filter variables
    let searchBy
    let searchQuery

    // Only if both type and search queries exist at once will they be assigned
    if(req.query.by && req.query.query){
        searchBy = req.query.by
        searchQuery = req.query.query
    }

    // Find all users by default, or optionally define:
    // - Property to search by + search query,
    // - Property to sort by + direction (asc/desc),
    // - Amount of users to return (limit)
    User.find({[searchBy]:searchQuery}).sort([[sortBy, direction]]).limit(limit)
        // Rather than just returning an array of ObjectIDs,
        // Populate the response wishlist array with the actual data, from the Game collection
        .populate("wishlist")
        .then((data) => {
            console.log(data);
            if(data.length > 0){
                res.status(200).json({
                    "msg" : limit ? `First ${limit} users retrieved` : `All users retrieved`,
                    "data": data
                });
                console.log(limit ? `First ${limit} users retrieved` : 'All users retrieved', `\nSorted by: ${sortBy} \nDirection: ${direction}`);
            }
            else{
                res.status(404).json({
                    "msg" : "No users found",
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

const updateUserByID = (req, res) => {
    let id = req.params.id;
    let body = req.body;

    // use bcrypt to re-hash the password. hashSync(password, salt)
    body.password = bcrypt.hashSync(req.body.password, 10)

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

module.exports = {
    registerUser,
    loginUser,
    readUsers,
    updateUserByID,
    deleteUserByID,
};


