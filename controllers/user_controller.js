const User = require('../models/user_schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// TODO: Implement error message for duplicate entries
const registerUser = (req, res) => {
    // assign newUser to a new User Object from user_schema, using the request body
    let newUser = new User(req.body)
    // use bcrypt to hash the password. hashSync(password, salt)
    newUser.password = bcrypt.hashSync(req.body.password, 10)
    // save the new user to the DB
    newUser.save((error, user) => {
        // if there is an error, respond with status 400 and send error back
        if(error){
            return res.status(400).send({
                message: error
            })
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
                }, 'steamedFruit')
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

    // TODO: Try to apply filter type & filter text like find({filter:text})
    User.find().sort([[sortBy, direction]]).limit(limit)
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

const readUsersByRole = (req, res) => {
    let role = req.params.role;

    User.find({role:role})
        .then((data) => {
            if(data){
                res.status(200).json({
                    "msg": `Users with role: ${role} retrieved`,
                    "data": data
                });
            }
            else {
                res.status(404).json({
                    "message": `No users with role: ${role} found`
                });
            }
        })
        .catch((err) => {
            console.error(err);
            if(err.name === 'CastError') {
                res.status(400).json({
                    "message": `Bad request, ${role} is not a valid role`
                });
            }
            else {
                res.status(500).json(err)
            }
        });
};

const readUserByID = (req, res) => {
    let id = req.params.id;

    // Connect to the database and retrieve user with :id
    User.findById(id)
        .then((data) => {
            if(data){
                res.status(200).json({
                    "msg": `User with _id: ${id} retrieved`,
                    "data": data
                });
            }
            else {
                res.status(404).json({
                    "message": `User with _id: ${id} not found`
                });
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

const readUserByUsername = (req, res) => {
    let username = req.params.username;

    User.findOne({ username : username })
        .then((data) => {
            if(data){
                res.status(200).json({
                    "msg": `User with username: ${username} retrieved`,
                    "data": data
                });
            }
            else {
                res.status(404).json({
                    "message": `User with username: ${username} not found`
                });
            }
        })
        .catch((err) => {
            console.error(err);
            if(err.name === 'CastError') {
                res.status(400).json({
                    "message": `Bad request, ${username} is not a valid username`
                });
            }
            else {
                res.status(500).json(err)
            }
        });
};

const readUserByEmail = (req, res) => {
    let email = req.params.email;

    User.findOne({ email : email })
        .then((data) => {
            if(data){
                res.status(200).json({
                    "msg": `User with email: ${email} retrieved`,
                    "data": data
                });
            }
            else {
                res.status(404).json({
                    "message": `User with email: ${email} not found`
                });
            }
        })
        .catch((err) => {
            console.error(err);
            if(err.name === 'CastError') {
                res.status(400).json({
                    "message": `Bad request, ${email} is not a valid email`
                });
            }
            else {
                res.status(500).json(err)
            }
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
                    "message": `Bad request, ${id} is not a valid _id`
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
    readUsersByRole,
    readUserByID,
    readUserByUsername,
    readUserByEmail,
    updateUserByID,
    deleteUserByID,
};


