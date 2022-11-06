const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    readUsers,
    updateUserByID,
    deleteUserByID,
} = require('../controllers/user_controller');

const { adminRequired } = require('../controllers/auth_controller')

router
    // Unauthenticated
    .post('/register', registerUser)
    .post('/login', loginUser)

    // Admin
    .get('/', adminRequired, readUsers)
    .put('/id/:id', adminRequired, updateUserByID)
    .delete('/id/:id', adminRequired, deleteUserByID)

module.exports = router;