// Required libraries: supertest (node testing lib for HTTP calls)
const request = require("supertest");

// App.js required to run the Express app
const app = require("../app");

// connect and disconnect functions from db.js
// needed to open/close database before/after tests
const {connectDB, disconnectDB} = require("../utils/db");

// initialising test user variables
let jestUser
let jestUserToken

// before all tests:
// - connect to the database
// - register a new user for testing
// - login as test user to get token
beforeAll(async () => {
	connectDB()
	const registerRes = await request(app).post('/api/users/register').send({
		username : "Jest",
		email : "test@test.test",
		password : "test",
		role: "admin"
	});
	jestUser = registerRes.body.data
	const loginRes = await request(app).post('/api/users/login').send({
		username: jestUser.username,
		email: jestUser.email,
		password: "test"
	});
	jestUserToken = loginRes.body.token;
})

// after all tests:
// - test user deletes itself
// - disconnect from the database
afterAll(async () => {
	const response =
		await request(app)
			.delete(`/api/users/id/${jestUser._id}`)
			.set('Authorization', `Bearer ${jestUserToken}`)
	await disconnectDB()
})

// description of the test group
describe("GET request to root ('/')", () => {
	// description of the expected test result
	it("1. No query params", async () => {
		// initialising response variable as result of get request to '/'
		const res = await request(app).get('/')
		// setting first expected result of test (status code 200)
		expect(res.statusCode).toBe(200)
		// setting second expected result of test (correct welcome message)
		expect(res.body).toBe('Welcome to Fruity Steam API!')
	});
});

describe("GET requests to games root ('/games')", () => {
	it("1. No query params", async () => {
		const res =
			await request(app)
				.get('/api/games')
				// setting authorization header with test user's token
				.set('Authorization', `Bearer ${jestUserToken}`)

		expect(res.statusCode).toBe(200)
		expect(res.body.data).toHaveLength(100)
	});
	it("2. Query param limit=1", async () => {
		const res =
			await request(app)
				.get('/api/games?limit=1')
				// setting authorization header with test user's token
				.set('Authorization', `Bearer ${jestUserToken}`)

		expect(res.statusCode).toBe(200)
		expect(res.body.data).toHaveLength(1)
	});
	it("3. Query param limit=2000", async () => {
		const res =
			await request(app)
				.get('/api/games?limit=2000')
				// setting authorization header with test user's token
				.set('Authorization', `Bearer ${jestUserToken}`)

		expect(res.statusCode).toBe(200)
		expect(res.body.data).toHaveLength(2000)
	});
});

describe("End-to-end game test", () => {
	let testGameID
	// POST test game
	it("1. POST test game", async () => {
		const res =
			await request(app)
				.post('/api/games')
				.set('Authorization', `Bearer ${jestUserToken}`)
				.send({
					"AppID": 1,
					"Name": "Test Game",
					"Price": "99.99"
				})

		expect(res.statusCode).toBe(201)
	});
	// GET test game
	it("2. GET test game by AppID", async () => {
		const res =
			await request(app)
				.get('/api/games?by=AppID&query=1')
				// setting authorization header with test user's token
				.set('Authorization', `Bearer ${jestUserToken}`)

		console.log("2. res body :", res.body)
		testGameID = res.body.data[0]._id
		expect(res.body.data[0].AppID).toBe(1)
		expect(res.statusCode).toBe(200)
	});
	// PUT test game
	it("3. PUT test game update", async () => {
		const res =
			await request(app)
				.put(`/api/games/id/${testGameID}`)
				.set('Authorization', `Bearer ${jestUserToken}`)
				.send({
					"AppID": 1,
					"Name": "Test Game: Renamed",
					"Price": 999.99
				})

		console.log("3. res body :", res.body)
		expect(res.statusCode).toBe(201)
		expect(res.body.Price).toBe(999.99)
	})
	// GET test game with sort
	it("4. GET test game using AppID sort and limit", async () => {
		const res =
			await request(app)
				.get('/api/games?sort=AppID&limit=1')
				// setting authorization header with test user's token
				.set('Authorization', `Bearer ${jestUserToken}`)

		console.log("4 res body: ", res.body)
		expect(res.body.data[0].Name).toBe("Test Game: Renamed")
		expect(res.statusCode).toBe(200)
	});
	// DEL test game
	it("5. DELETE test game", async () => {
		const res =
			await request(app)
				.delete(`/api/games/id/${testGameID}`)
				.set('Authorization', `Bearer ${jestUserToken}`)

		expect(res.statusCode).toBe(200)
		console.log("5 res: ", res.body)
	})
})
