// Required libraries: supertest (node testing lib for HTTP calls)
const request = require("supertest");

// App.js required to run the Express app
const app = require("../app");

// connect and disconnect functions from db.js
// needed to open/close database before/after tests
const {connectDB, disconnectDB} = require("../utils/db");

let jestUser
let jestUserToken

// before all tests, connect to database & login
beforeAll(async () => {
	connectDB()
	const registerRes = await request(app).post('/api/users/register').send({
		username : "Jest",
		email : "test@test.test",
		password : "test",
		role: "admin"
	});
	jestUser = registerRes.body.data
	// console.log("Jest user: ", jestUser)
	// console.log("Jest user ID: ", jestUser._id)
	// console.log("Jest user ID type: ", typeof jestUser._id)
	// console.log("Jest user name: ", jestUser.username)
	// console.log("Jest user email: ", jestUser.email)
	const loginRes = await request(app).post('/api/users/login').send({
		username: jestUser.username,
		email: jestUser.email,
		password: "test"
	});
	jestUserToken = loginRes.body.token;
	// console.log("Jest user token: ", jestUserToken)
})

// after all tests, disconnect from database
afterAll(async () => {
	const response =
		await request(app)
			.delete(`/api/users/id/${jestUser._id}`)
			.set('Authorization', `Bearer ${jestUserToken}`)
	// console.log("Delete response: ", response.body)
	await disconnectDB()
})

// function jestRegister() {
// 	describe("POST request to users register ('/users/register')", () => {
// 		it("Should respond with a status 200 and register user", async () => {
// 			const res = await request(app).post('/api/users/register').send({
// 				username : "Jest",
// 				email : "test@test.test",
// 				password : "test"
// 			})
// 			expect(res.statusCode).toBe(200)
// 			jestUserID = res.body.id
// 		});
// 	});
// }
//
// function jestDelete() {
// 	describe("POST request to users register ('/users/register')", () => {
// 		it("Should respond with a status 200 and register user", async () => {
// 			const res = await request(app).delete(`/users/id/${jestUserID}`)
// 			expect(res.statusCode).toBe(200)
// 		});
// 	});
// }

// description of the test group
describe("GET request to root ('/')", () => {
	// description of the expected test result
	it("Should respond with a status 200 and message", async () => {
		// initialising response variable as result of get request to '/'
		const res = await request(app).get('/')
		// setting first expected result of test (status code 200)
		expect(res.statusCode).toBe(200)
		// setting second expected result of test (correct welcome message)
		expect(res.body).toBe('Welcome to Fruity Steam API!')
	});
});

describe("GET request to games root ('/games/')", () => {
	it("Should respond with a status 200 and message", async () => {
		const res =
			await request(app)
				.get('/api/games/')
				.set('Authorization', `Bearer ${jestUserToken}`)

		expect(res.statusCode).toBe(200)
	});
});
