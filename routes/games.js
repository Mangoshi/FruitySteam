const express = require('express');
const router = express.Router();

const { 
    readGames, 
    readGameByID,
    readGameByAppID,
    readGameByName,
    createGame,
    updateGameByID,
    updateGameByAppID,
    deleteGameByAppID
  } = require('../controllers/game_controller');

router
    // Unauthenticated
    .get('/', readGames)
    .get('/id/:id', readGameByID)
    .get('/app_id/:id', readGameByAppID)
    .get('/name/:name', readGameByName)

    // Admin
    // TODO: adminRequired
    .post('/', createGame)
    .put('/id/:id', updateGameByID)
    .put('/app_id/:id', updateGameByAppID)
    .delete('/app_id/:id', deleteGameByAppID);

module.exports = router;