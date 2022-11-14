const Game = require('../models/game_schema');

// Read all games (with optional filters) //
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

    // Initialize filter variables
    let searchBy
    let searchQuery

    // Only if both type and search queries exist at once will they be assigned
    if(req.query.by && req.query.query){
        searchBy = req.query.by
        searchQuery = req.query.query
    }

    // Initialize var to be used in find function
    let findString = searchQuery

    // If the user is not searching by a Mongo ObjectId...
    if (searchBy !== '_id'){
        // Initialize var to return either true or NaN,
        // to check if searchQuery is a number.
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
        // Then, if success
        .then(async (data) => {
            // console.log(data);
            // If data array is not empty
            if (data.length > 0) {
                // Use mongoose countDocuments function to count docs matching search query
                let countQuery = await Game.countDocuments({[searchBy]: findString})
                // console.log("queryTotal: ", queryTotal())
                // Respond with status 200: OK & JSON:
                // - msg = amount of games in data array
                // - total = amount of games matching query
                // - page = selected page
                // - data = the data array from the response
                res.status(200).json({
                    "msg": `${data.length} game(s) retrieved`,
                    "total": `${countQuery} game(s) match your query`,
                    "page": page,
                    "data": data
                });
                // Log the above data to console with line breaks for readability
                console.log(`${countQuery} game(s) match your query \n${data.length} games per page \nPage: ${page} \nSorted by: ${sortBy} \nDirection: ${direction}`);
            // Else if data array is empty
            } else {
                // Respond with status 404: Not Found & JSON:
                // - msg = error message
                // - data = error data
                res.status(404).json({
                    "msg": "No games found",
                    "data": data
                });
                // Log to console
                console.log("No games found");
            }
        })
        // If error, catch error
        .catch((err) => {
            // console.log(err);
            // If error name is CastError
            if(err.name==="CastError"){
                // Respond with status 400: Bad Request & JSON:
                // - message = error message
                // - error = error data
                res.status(400).json({
                    "message" : `Cast error occurred, ${searchBy} query needs to be a valid ${err.kind}!`,
                    "error": err
                });
            // If any other error
            } else {
                // Log to console
                console.log(err)
                // Respond with status 500: Internal Server Error & error data
                res.status(500).json(err);
            }
        });
};

// Create a game //
const createGame = (req, res) => {

    // console.log(req.body);
    // Initialize gameData as request body
    let gameData = req.body;

    // Use mongoose create function on game schema using gameData
    Game.create(gameData)
        // Then, if success
        .then((data) => {
            // Log message and data to console
            console.log('New Game Created!', data);
            // Respond with status 201: Created and return data
            res.status(201).json(data);
        })
        // If error, catch error
        .catch((err) => {
            // If error name is ValidationError
            if(err.name === 'ValidationError'){
                // Log to console
                console.error('Validation Error!!', err);
                // Respond with status 422: Unprocessable Entity & JSON:
                // - msg = simplified error message
                // - error = full error message
                res.status(422).json({
                    "msg": "Validation Error",
                    "error" : err.message 
                });
            // Else if error code is 11000 (Duplicate key error)
            } else if (err.code === 11000) {
                // Log to console
                console.error('DuplicateKey Error!!', err);
                // Respond with status 400: Bad Request & JSON:
                // - msg = simplified error message
                // - error = full error message
                res.status(400).json({
                    "msg": `The AppID ${err.keyValue.AppID} already exists! No duplicates allowed.`,
                    "error" : err.message
                });
            }
            // Else if any other error
            else {
                // Log to console
                console.error(err);
                // Return status 500: Internal Server Error & the error
                res.status(500).json(err);
            }
        });
};

// Update a game by MongoDB _id //
const updateGameByID = (req, res) => {

    // Initialize id as id from request's query parameter
    let id = req.params.id;
    // Initialize body as request body
    let body = req.body;

    // Use mongoose findByIdAndUpdate function using id and body
    Game.findByIdAndUpdate(id, body, {
        // Mongo _id = query param id
        _id: id,
        // New option governs whether old data or updated data is returned
        new: true
    })
        // Then, if success
        .then((data) => {
            // If data exists
            if(data){
                // Respond with status 201: Created & the data
                res.status(201).json(data);
                // Log to console
                console.log(data, 'Game Updated!');
            }
            // If data doesn't exist
            else {
                // Respond with status 404: Not Found & error message
                res.status(404).json({"message": `Game with id: ${id} not found`});
                // Log to console
                console.log('Game Not Updated!');
            }

        })
        // If error, catch error
        .catch((err) => {
            // If error name is ValidationError
            if(err.name === 'ValidationError'){
                // Log to console
                console.error('Validation Error!!', err);
                // Respond with status 422: Unprocessable Entity & error messages
                res.status(422).json({
                    "msg": "Validation Error",
                    "error" : err.message
                });
            }
            // Else if error name is CastError
            else if(err.name === 'CastError') {
                // Respond with status 400: Bad Request & error message
                res.status(400).json({
                    "message": `Bad request, ${id} is not a valid id`
                });
            }
            // Else if any other error
            else {
                // Log to console
                console.error(err);
                // Respond with status 500: Internal Server Error & the error
                res.status(500).json(err);
            }
        });
};

// Delete a game by MongoDB _id //
const deleteGameByID = (req, res) => {

    // Initialize id as id from request's query parameter
    let id = req.params.id;

    // Use mongoose findByIdAndDelete function using id
    Game.findByIdAndDelete({ _id : id })
        // Then, if success
        .then((data) => {
            // If data is returned
            if(data){
                // Respond with status 200: OK & success message
                res.status(200).json({
                    "message": `Game with id: ${id} deleted successfully`
                });
                // Log to console
                console.log("Game Deleted!")
            }
            // If data is not returned
            else {
                // Respond with status 404: Not Found & error message
                res.status(404).json({
                    "message": `Game with id: ${id} not found`
                });
                // Log to console
                console.log("Game Not Deleted!")
            }
            
        })
        // If error, catch error
        .catch((err) => {
            // Log to console
            console.error(err);
            // If error name is CastError
            if(err.name === 'CastError') {
                // Respond with status 400: Bad Request & error message
                res.status(400).json({
                    "message": `Bad request, ${id} is not a valid id`
                });
            }
            // If any other error
            else {
                // Respond with status 500: Internal Server Error & the error
                res.status(500).json(err)
            } 
        });
};

// Export game controller functions
module.exports = {
    readGames,
    createGame,
    updateGameByID,
    deleteGameByID
};


