const Game = require('../models/game_schema');

// Read all games (with optional limit) //
const readGames = (req, res) => {

    let limit = req.query.limit

    // Setting a default limit of 1000 for now as the entire DB is very large (over 63,000 games)
    // If "?limit=x" is used, it will return that amount instead.

    Game.find().sort({'AppID': +1}).limit(limit ? limit : 1000)
        .then((data) => {
            console.log(data);
            if(data.length > 0){
                res.status(200).json({
                    "msg" : `First ${limit} games retrieved`,
                    "data": data
                });
                console.log(`First ${limit} games retrieved`);
            }
            else{
                res.status(404).json({
                    "msg" : "No games found",
                    "data": data
                });
                console.log("No games found");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};

// Read one game by MongoDB _id //
const readGameByID = (req, res) => {

    let id = req.params.id;

    // console.log("req: ",req.params)
    // console.log("res: ",res)

    // Connect to the database and retrieve game with :id
    Game.findById(id)
        .then((data) => {

            if(data){
                res.status(200).json(data);
            }
            else {
                res.status(404).json({
                    "message": `Game with _id: ${id} not found`
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

// Read one game by Steam AppID //
const readGameByAppID = (req, res) => {

    let AppID = req.params.id;

    // using findOne instead of findById since we're using Steam App IDs

    Game.findOne({
        AppID: AppID
    })
        .then((data) => {

            if(data){
                res.status(200).json(data);
            }
            else {
                res.status(404).json({
                    "message": `Game with AppID: ${AppID} not found`
                });
            }

        })
        .catch((err) => {
            console.error(err);
            if(err.name === 'CastError') {
                res.status(400).json({
                    "message": `Bad request, ${AppID} is not a valid AppID`
                });
            }
            else {
                res.status(500).json(err)
            }
        });
};

// Read one game by its name //
const readGameByName = (req, res) => {

    let name = req.params.name;

    // using findOne instead of findById since we're using game names

    Game.findOne({
        Name: name
    })
        .then((data) => {

            if(data){
                res.status(200).json(data);
            }
            else {
                res.status(404).json({
                    "message": `Game with name: ${name} not found`
                });
            }

        })
        .catch((err) => {
            console.error(err);
            if(err.name === 'CastError') {
                res.status(400).json({
                    "message": `Bad request, ${name} is not a valid name`
                });
            }
            else {
                res.status(500).json(err)
            }
        });
};

// Create a game //
const createGame = (req, res) => {

    // console.log(req.body);
    let gameData = req.body;

    Game.create(gameData)
        .then((data) => {
            console.log('New Game Created!', data);
            res.status(201).json(data);
        })
        .catch((err) => {
            if(err.name === 'ValidationError'){
                console.error('Validation Error!!', err);
                res.status(422).json({
                    "msg": "Validation Error",
                    "error" : err.message 
                });
            }
            else {
                console.error(err);
                res.status(500).json(err);
            }
        });
};

// Update a game by MongoDB _id //
const updateGameByID = (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Game.findOneAndUpdate(id, body, {
        _id: id,
        new: true
    })
        .then((data) => {

            if(data){
                res.status(201).json(data);
                console.log(data, 'Game Updated!');
            }
            else {
                res.status(404).json({"message": `Game with id: ${id} not found`});
                console.log('Game Not Updated!');
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
                    "message": `Bad request, ${id} is not a valid id`
                });
            }
            else {
                console.error(err);
                res.status(500).json(err);
            }
        });
};

// Update a game by Steam AppID //
const updateGameByAppID = (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Game.findOneAndUpdate(id, body, {
        AppID: id,
        new: true
    })
        .then((data) => {

            if(data){
                res.status(201).json(data);
                console.log(data, 'Game Updated!');
            }
            else {
                res.status(404).json({"message": `Game with AppID: ${id} not found`});
                console.log('Game Not Updated!');
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
                    "message": `Bad request, ${id} is not a valid AppID`
                });
            }
            else {
                console.error(err);
                res.status(500).json(err);
            }
        });
};

// Delete a game by Steam AppID //
const deleteGameByAppID = (req, res) => {

    let id = req.params.id;

    Game.deleteOne({ AppID: id })
        .then((data) => {

            if(data.deletedCount){
                res.status(200).json({
                    "message": `Game with id: ${id} deleted successfully`
                });
                console.log("Game Deleted!")
            }
            else {
                res.status(404).json({
                    "message": `Game with id: ${id} not found`
                });
                console.log("Game Not Deleted!")
            }
            
        })
        .catch((err) => {
            console.error(err);
            if(err.name === 'CastError') {
                res.status(400).json({
                    "message": `Bad request, ${id} is not a valid id`
                });
            }
            else {
                res.status(500).json(err)
            } 
        });
};

module.exports = {
    readGames,
    readGameByID,
    readGameByAppID,
    readGameByName,
    createGame,
    updateGameByID,
    updateGameByAppID,
    deleteGameByAppID
};


