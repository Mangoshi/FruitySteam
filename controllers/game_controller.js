const Game = require('../models/game_schema');

// Read all games (with optional limit) //
const readGames = (req, res) => {
    // Setting a default limit of 100 as the entire DB is very large (over 63,000 games)
    // If "?limit=x" is used, it will return that amount instead.
    let limit = req.query.limit ? req.query.limit : 100
    // Default: AppID
    let sortBy = req.query.sort ? req.query.sort : 'AppID'
    // Default: Ascending
    let direction = req.query.direction ? req.query.direction : 1
    // Default: 1
    let page = req.query.page ? req.query.page : 1

    // Initialising filter variables
    let searchBy
    let searchQuery

    // Only if both type and search queries exist at once will they be assigned
    if(req.query.by && req.query.query){
        searchBy = req.query.by
        searchQuery = req.query.query
    }

    // Initialising var to be used in find function
    let findString = searchQuery

    // If the user is not searching by a Mongo ObjectId...
    if (searchBy !== '_id'){
        // Initialising var to return either true or NaN, to check if searchQuery is a number
        let searchQueryParsed = parseInt(searchQuery)
        // If it is a number...
        if(Number.isInteger(searchQueryParsed)){
            // findString = the number
            findString = searchQueryParsed
            // If it isn't a number...
        } else {
            // findString = Regular Expression to look for any matches in the string, not just exact matches.
            // Doing this because tags and categories are comma separated in one big string
            findString = { $regex: '.*' + searchQuery + '.*' }
        }
    }

    // console.log("findString: ", findString)
    // console.log("type: ", typeof findString)

    // Find all games by default, or optionally define:
    // - Property to search by + search query (findString).
    Game.find({[ searchBy ] : findString})
        // - Property to sort by + direction (asc/desc),
        .sort([[sortBy, direction]])
        // - Amount of games to return (limit)
        .limit(limit)
        // - How many "pages" of games to skip
        .skip(limit*(page-1))
        .then(async (data) => {
            console.log(data);
            if (data.length > 0) {
                let countQuery = await Game.countDocuments({[searchBy]: findString})
                // console.log("queryTotal: ", queryTotal())
                res.status(200).json({
                    "msg": `${data.length} game(s) retrieved`,
                    "total": `${countQuery} game(s) match your query`,
                    "page": page,
                    "data": data
                });
                console.log(`${countQuery} game(s) match your query \n${data.length} games per page \nPage: ${page} \nSorted by: ${sortBy} \nDirection: ${direction}`);
            } else {
                res.status(404).json({
                    "msg": "No games found",
                    "data": data
                });
                console.log("No games found");
            }
        })
        .catch((err) => {
            // console.log(err);
            if(err.name==="CastError"){
                res.status(400).json({
                    "message" : `Cast error occurred, ${searchBy} query needs to be a valid ${err.kind}!`,
                    "error": err
                });
            } else {
                console.log(err)
                res.status(500).json(err);
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
            } else if (err.code === 11000) {
                console.error('DuplicateKey Error!!', err);
                res.status(400).json({
                    "msg": `The AppID ${err.keyValue.AppID} already exists! No duplicates allowed.`,
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

    Game.findByIdAndUpdate(id, body, {
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

// Delete a game by Steam AppID //
const deleteGameByID = (req, res) => {

    let id = req.params.id;

    Game.findByIdAndDelete({ _id : id })
        .then((data) => {

            if(data){
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
    createGame,
    updateGameByID,
    deleteGameByID
};


