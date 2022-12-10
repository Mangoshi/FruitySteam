// Import express package as express
const express = require('express');
// Initialize router variable as express' router
const router = express.Router();

// Import functions from user controller
const {
    registerUser,
    loginUser,
    readUsers,
    readUser,
    updateUserByID,
    deleteUserByID,
} = require('../controllers/user_controller');

// Import adminRequired from authentication controller
const { adminRequired, sameUserOrAdminRequired} = require('../controllers/auth_controller')

// Define routing
router
    // Unauthenticated routes
    .post('/register', registerUser)
    .post('/login', loginUser)

    // Authenticated routes
    .get('/id/:id', sameUserOrAdminRequired, readUser)

    // Admin routes
    .get('/', adminRequired, readUsers)
    .put('/id/:id', sameUserOrAdminRequired, updateUserByID)
    .delete('/id/:id', adminRequired, deleteUserByID)

// Export routes for use in app.js
module.exports = router;
