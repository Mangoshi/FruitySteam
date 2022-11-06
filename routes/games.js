const express = require('express');
const router = express.Router();

const { 
    readGames, 
    readGameByID,
    readGameByAppID,
    readGameByName,
    createGame,
    updateGameByID,
    deleteGameByID
} = require('../controllers/game_controller');

const { loginRequired, adminRequired } = require('../controllers/auth_controller')

router
    // Unauthenticated
    .get('/', readGames)

    // Authenticated
    .get('/id/:id', loginRequired, readGameByID)
    .get('/app_id/:id', loginRequired, readGameByAppID)
    .get('/name/:name', loginRequired, readGameByName)

    // Admin
    .post('/', adminRequired, createGame)
    .put('/id/:id', adminRequired, updateGameByID)
    .delete('/id/:id', adminRequired, deleteGameByID);

module.exports = router;