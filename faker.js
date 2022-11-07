// require the necessary libraries
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
require('dotenv').config();

const User = require('./models/user_schema')

let selected_database = 'Datasets'

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

let count = process.argv[2]

let fakedUsers = []

for(let i = 0; i < count; i++) {

	let fakeUser = {
		username: faker.name.firstName(),
		email: faker.internet.email(this.username),
		password: faker.internet.password(),
		role: faker.helpers.arrayElement(['basic', 'admin']),
	}
	fakedUsers.push(fakeUser)
}

	let seedDB = async () => {
		await User.insertMany(fakedUsers)
	}

	seedDB().then(()=> {
		console.log("Operation successful!")
		mongoose.connection.close()
	})
