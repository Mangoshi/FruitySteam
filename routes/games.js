const express = require('express');
const router = express.Router();

const { 
    readGames,
    createGame,
    updateGameByID,
    deleteGameByID
} = require('../controllers/game_controller');

const { loginRequired, adminRequired } = require('../controllers/auth_controller')

router
    // Authenticated
    .get('/', loginRequired, readGames)

    // Admin
    .post('/', adminRequired, createGame)
    .put('/id/:id', adminRequired, updateGameByID)
    .delete('/id/:id', adminRequired, deleteGameByID);

module.exports = router;