// Import necessary libraries
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
require('dotenv').config();

// Import user schema
const User = require('./models/user_schema')

// Select target database
let selected_database = 'Datasets'

// Connect to MongoDB using DB_ATLAS_URL from .env file, and target DB
mongoose.connect(`${process.env.DB_ATLAS_URL}/${selected_database}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(() => {
		console.log("Successfully connected to your MongoDB database!");
		console.log(`Currently connected to the ${selected_database} database.`)
	}).catch((err) => {
		console.log(err)
	})

// console.log("0: ", process.argv[0])
// console.log("1: ", process.argv[1])
// console.log("2: ", process.argv[2])

// Initialising count as the first argument passed on command-line
// Converting to integer through parseInt() so that it is either a number or NaN
let count = parseInt(process.argv[2])

// Checking to see if count is an integer
if(Number.isInteger(count)){
	// If it is, log it and move on
	console.log("Argument is an integer!")
} else {
	// If it isn't, warn user and set count to 1
	console.log(`Argument is a ${typeof process.argv[2]}! An integer is required to define amount of users.`)
	count = 1
}
console.log(`Generating ${count} user(s)!`)

// Initialising fakedUsers empty array
let fakedUsers = []

// For loop defined by count (command-line argument)
for(let i = 0; i < count; i++) {

	// Initialising fakeUser Object
	let fakeUser = {
		// Generating username
		username: faker.name.firstName(),
		// Generating email based on username
		email: faker.internet.email(this.username),
		// Generating password // TODO: hash it!
		password: faker.internet.password(),
		// Generating role (picks from basic and admin)
		role: faker.helpers.arrayElement(['basic', 'admin']),
	}
	// Push generated user to fakedUsers array
	fakedUsers.push(fakeUser)
}

// Using insertMany function to insert entire array into the database
let seedDB = async () => {
	await User.insertMany(fakedUsers)
}

// After seeding, log success and close connection to database
seedDB().then(()=> {
	console.log("Operation successful!")
	mongoose.connection.close()
})
