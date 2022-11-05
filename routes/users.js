const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    readUsers,
    readUsersByRole,
    readUserByID,
    readUserByUsername,
    readUserByEmail,
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
    .get('/role/:role', adminRequired, readUsersByRole)
    .get('/id/:id', adminRequired, readUserByID)
    .get('/username/:username', adminRequired, readUserByUsername)
    .get('/email/:email', adminRequired, readUserByEmail)
    .put('/id/:id', adminRequired, updateUserByID)
    .delete('/id/:id', adminRequired, deleteUserByID)

module.exports = router;