const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    readUsers,
    readOneUser,
    updateUser,
    deleteUser,
} = require('../controllers/user_controller');

const { adminRequired } = require('../controllers/auth_controller')

router
    // Unauthenticated
    .post('/register', registerUser)
    .post('/login', loginUser)

    // Admin
    .get('/', adminRequired, readUsers)
    .get('/:id', adminRequired, readOneUser)
    .put('/:id', adminRequired, updateUser)
    .delete('/:id', adminRequired, deleteUser);

module.exports = router;