// Import express package as express
const express = require('express');
// Initialize router variable as express' router
const router = express.Router();

// Import functions from game controller
const { 
    readGames,
    createGame,
    updateGameByID,
    deleteGameByID
} = require('../controllers/game_controller');

// Import loginRequired & adminRequired from authentication controller
const { loginRequired, adminRequired } = require('../controllers/auth_controller')

// Define routing
router
    // Authenticated routes
    .get('/', loginRequired, readGames)

    // Admin routes
    .post('/', adminRequired, createGame)
    .put('/id/:id', adminRequired, updateGameByID)
    .delete('/id/:id', adminRequired, deleteGameByID);

// Export routes for use in app.js
module.exports = router;