// Required libraries: supertest (node testing lib for HTTP calls)
const request = require("supertest");

// App.js required to run the Express app
const app = require("../app");

// connect and disconnect functions from db.js
// needed to open/close database before/after tests
const {connectDB, disconnectDB} = require("../utils/db");

let jestUserToken
let jestUserID

// before all tests, connect to database & login
beforeAll(async () => {
	connectDB()
	const response = await request(app).post('/api/users/login').send({
		username : "Jest",
		email : "test@test.test",
		password : "test"
	});
	jestUserToken = response.body.token;
	// console.log(jestUserToken)
})

// after all tests, disconnect from database
afterAll(disconnectDB)

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
		const res = await request(app)
			.get('/api/games/')
			.set('Authorization', `Bearer ${jestUserToken}`)
		expect(res.statusCode).toBe(200)
	});
});