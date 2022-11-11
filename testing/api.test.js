// Required libraries: supertest (node testing lib for HTTP calls)
const request = require("supertest");

// App.js required to run the Express app
const app = require("../app");

// connect and disconnect functions from db.js
// needed to open/close database before/after tests
const {connectDB, disconnectDB} = require("../utils/db");

// before all tests, connect to database
beforeAll(connectDB)

// after all tests, disconnect from database
afterAll(disconnectDB)

// description of the test group
describe("GET root tests", () => {
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
