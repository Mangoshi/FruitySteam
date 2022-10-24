const mongoose = require('mongoose');

const connect = async () => {
    let db = null;

    let selected_database = 'Datasets'

    try {
        await mongoose.connect(`${process.env.DB_ATLAS_URL}/${selected_database}?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Successfully connected to your MongoDB database!");
        console.log(`Currently connected to the ${selected_database} database.`)
        db = mongoose.connection;
    }
    catch(error) {
        console.log(error);
    }
    finally {
        if(db !== null && db.readyState === 1) {
            // await db.close();
            // console.log("Disconnected successfully from db");
        }
    }
};

module.exports = connect;