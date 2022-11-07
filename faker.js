// require the necessary libraries
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
require('dotenv').config();

const User = require('./models/user_schema')

let selected_database = 'Datasets'

mongoose
	.connect(`${process.env.DB_ATLAS_URL}/${selected_database}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(() => {
		console.log("Successfully connected to your MongoDB database!");
		console.log(`Currently connected to the ${selected_database} database.`)
	}).catch((err) => {
		console.log(err)
	})

const username = faker.name.firstName()
const email = faker.internet.email(username)
const password = faker.internet.password()
const role = faker.helpers.arrayElement(['basic', 'admin'])

const seedUsers = [
	{
		username: username,
		email: email,
		password: password,
		role: role,
	}
]

const seedDB = async () => {
	await User.insertMany(seedUsers)
}

seedDB().then(()=> {
	mongoose.connection.close()
})