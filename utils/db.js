// Import mongoose package as mongoose
const mongoose = require('mongoose');

// Initialize connectDB function
const connectDB = () => {
    // Initialize db variable as null
    let db = null;

    // Initialize database to target from MongoDB cluster
    let selected_database = 'Datasets'

    // Try to connect to MongoDB database
    try {
        // Connect using DB_ATLAS_URL from .env file, with selected database appended
        mongoose.connect(`${process.env.DB_ATLAS_URL}/${selected_database}`, {
            // Recommended connect options
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // console.log("Successfully connected to your MongoDB database!");
        // console.log(`Currently connected to the ${selected_database} database.`)

        // Assign mongoose connection state to db variable
        db = mongoose.connection;
    }
    // If there's an error, catch it
    catch(error) {
        // Log the error
        console.log(error);
    }
    // Finally block [DEACTIVATED]
    finally {
        // If database = null && database is connected
        // (0:disconnected, 1:connected, 2:connecting, 3:disconnecting)
        if(db !== null && db.readyState === 1) {
            // Close db connection and log to console
            // await db.close();
            // console.log("Disconnected successfully from db");
        }
    }
};

// Initialize disconnectDB function
const disconnectDB = async () => {
    // Send disconnect signal to MongoDB database
    await mongoose.disconnect();
}

// Export connectDB and disconnectDB functions
module.exports = {connectDB, disconnectDB};