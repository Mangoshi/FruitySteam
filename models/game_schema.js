const mongoose = require('mongoose');

// Defining game schema based off imported Steam dataset
const gameSchema = new mongoose.Schema(
    {
        AppID: {
            type: Number,
            unique: true,
            required: [true, 'AppID field is required']
        },
        Name: {
            type: String,
            required: [true, 'Name field is required'],
        },
        "Release date": {
            type: Date,
        },
        "Estimated owners": {
            type: String
        },
        "Peak CCU": {
            type: Number
        },
        "Required age": {
            type: Number
        },
        Price: {
            type: Number,
            required: [true, 'Date field is required'],
        },
        "DLC count": {
            type: Number
        },
        "About the game": {
            type: String
        },
        "Supported languages": {
            type: String
        },
        "Full audio languages": {
            type: String
        },
        Reviews: {
            type: String
        },
        "Header image": {
            type: String
        },
        Website: {
            type: String
        },
        "Support url": {
            type: String
        },
        "Support email": {
            type: String
        },
        Windows: {
            type: Boolean
        },
        Mac: {
            type: Boolean
        },
        Linux: {
            type: Boolean
        },
        "Metacritic score": {
            type: Number
        },
        "Metacritic url": {
            type: String
        },
        "User score": {
            type: Number
        },
        Positive: {
            type: Number
        },
        Negative: {
            type: Number
        },
        "Score rank": {
            type: String
        },
        Achievements: {
            type: Number
        },
        Recommendations: {
            type: Number
        },
        Notes: {
            type: String
        },
        "Average playtime forever": {
            type: Number
        },
        "Average playtime two weeks": {
            type: Number
        },
        "Median playtime forever": {
            type: Number
        },
        "Median playtime two weeks": {
            type: Number
        },
        Developers: {
            type: String
        },
        Publishers: {
            type: String
        },
        Categories: {
            type: String
        },
        Genres: {
            type: String
        },
        Tags: {
            type: String
        },
        Screenshots: {
            type: String
        },
        Movies: {
            type: String
        }
    },
    { timestamps: false }
);

// This is to be extra sure mongoose is aware of the unique fields
// A mongo shell command was required too: db.games.ensureIndex({AppID: 1}, {unique: true, dropDups: true});
// Without this command, duplicates were still allowed as Mongo can't enforce it while duplicates remain in the DB
gameSchema.index({ AppID: 1 }, { unique: true});

// Export game schema
module.exports = mongoose.model('Game', gameSchema);