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
            return res.status(400).send({
                message: error
            })
        }
        // else if successful
        else {
            // remove hashed password before responding to the client
            user.password = undefined
            // return the new user to the client
            return res.json(user)
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

// TODO: Fix up
const readUsers = (req, res) => {
    res.status(200).json({
        "msg" : "All users retrieved"
    });
};

// TODO: Fix up
const readOneUser = (req, res) => {
    let id = req.params.id;
    // connect to db and retrieve user with :id

    res.status(200).json({
        "msg" : `You retrieved user with ID: ${id}`
    });
};

// TODO: Fix up
const updateUser = (req, res) => {
    let id = req.params.id;
    let data = req.body;
    // connect to db and retrieve user with :id
    // if user exists, validate the new user info, if all good update user
    data.id = id;
    res.status(200).json({
        "msg" : `You edited user with ID: ${id}`,
        "data" : data
    });
};

// TODO: Fix up
const deleteUser = (req, res) => {
    let id = req.params.id;
    // connect to db and retrieve user with :id and delete them
    res.status(200).json({
        "msg" : `You deleted user with ID: ${id}`
    });
};

module.exports = {
    registerUser,
    loginUser,
    readUsers,
    readOneUser,
    updateUser,
    deleteUser,
};


