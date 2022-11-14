// Required libraries: supertest (node testing lib for HTTP calls)
const request = require("supertest");

// App.js required to run the Express app
const app = require("../app");

// Connect and disconnect functions from db.js
// Needed to open/close database before/after tests
const {connectDB, disconnectDB} = require("../utils/db");

// Initialising test user variables
let jestAdmin
let jestAdminToken

// Before all tests:
// - connect to the database
// - register a new user for testing
// - login as test user to get token
beforeAll(async () => {
	connectDB()
	const registerRes = await request(app).post('/api/users/register').send({
		username : "Jest",
		email : "jest@fruitbowl.test",
		password : "test",
		role: "admin"
	});
	jestAdmin = registerRes.body.data
	const loginRes = await request(app).post('/api/users/login').send({
		username: jestAdmin.username,
		email: jestAdmin.email,
		password: "test"
	});
	jestAdminToken = loginRes.body.token;
})

// After all tests:
// - test user deletes itself
// - disconnect from the database
afterAll(async () => {
	const response =
		await request(app)
			.delete(`/api/users/id/${jestAdmin._id}`)
			.set('Authorization', `Bearer ${jestAdminToken}`)
	await disconnectDB()
})

// Description of the test group
describe("Test 1: GET request to root ('/')", () => {
	// Description of the expected test result
	it("T1-1. No query params", async () => {
		// Initialising response variable as result of get request to '/'
		const res = await request(app).get('/')
		// Setting first expected result of test (status code 200)
		expect(res.statusCode).toBe(200)
		// Setting second expected result of test (correct welcome message)
		expect(res.body).toBe('Welcome to Fruity Steam API!')
	});
});

describe("Test 2: GET requests to games root ('/games')", () => {
	it("T2-1. No query params", async () => {
		const res =
			await request(app)
				.get('/api/games')
				// Setting authorization header with test user's token
				.set('Authorization', `Bearer ${jestAdminToken}`)

		expect(res.statusCode).toBe(200)
		expect(res.body.data).toHaveLength(100)
	});
	it("T2-2. Query param limit=1", async () => {
		const res =
			await request(app)
				.get('/api/games?limit=1')
				.set('Authorization', `Bearer ${jestAdminToken}`)

		expect(res.statusCode).toBe(200)
		expect(res.body.data).toHaveLength(1)
	});
	it("T2-3. Query param limit=1000", async () => {
		const res =
			await request(app)
				.get('/api/games?limit=1000')
				.set('Authorization', `Bearer ${jestAdminToken}`)

		expect(res.statusCode).toBe(200)
		expect(res.body.data).toHaveLength(1000)
	});
});

describe("Test 3: End-to-end game test", () => {
	let testGameID
	// POST test game
	it("T3-1. POST test game", async () => {
		const res =
			await request(app)
				.post('/api/games')
				.set('Authorization', `Bearer ${jestAdminToken}`)
				.send({
					"AppID": 1,
					"Name": "Test Game",
					"Price": "99.99"
				})

		expect(res.statusCode).toBe(201)
	});
	// GET test game
	it("T3-2. GET test game by AppID", async () => {
		const res =
			await request(app)
				.get('/api/games?by=AppID&query=1')
				.set('Authorization', `Bearer ${jestAdminToken}`)

		// console.log("2. res body :", res.body)
		testGameID = res.body.data[0]._id
		expect(res.body.data[0].AppID).toBe(1)
		expect(res.statusCode).toBe(200)
	});
	// PUT test game
	it("T3-3. PUT test game update", async () => {
		const res =
			await request(app)
				.put(`/api/games/id/${testGameID}`)
				.set('Authorization', `Bearer ${jestAdminToken}`)
				.send({
					"AppID": 1,
					"Name": "Test Game: Renamed",
					"Price": 999.99
				})

		// console.log("3. res body :", res.body)
		expect(res.statusCode).toBe(201)
		expect(res.body.Price).toBe(999.99)
	})
	// GET test game with sort
	it("T3-4. GET test game using AppID sort and limit", async () => {
		const res =
			await request(app)
				.get('/api/games?sort=AppID&limit=1')
				.set('Authorization', `Bearer ${jestAdminToken}`)

		// console.log("4 res body: ", res.body)
		expect(res.body.data[0].Name).toBe("Test Game: Renamed")
		expect(res.statusCode).toBe(200)
	});
	// DEL test game
	it("T3-5. DELETE test game", async () => {
		const res =
			await request(app)
				.delete(`/api/games/id/${testGameID}`)
				.set('Authorization', `Bearer ${jestAdminToken}`)

		// console.log("5 res: ", res.body)
		expect(res.statusCode).toBe(200)
	})
})

describe("Test 4: GET requests to user root ('/users')", () => {
	it("T4-1. No query params", async () => {
		const res =
			await request(app)
				.get('/api/users')
				.set('Authorization', `Bearer ${jestAdminToken}`)

		expect(res.statusCode).toBe(200)
	});
	it("T4-2. Query param limit=1", async () => {
		const res =
			await request(app)
				.get('/api/users?limit=1')
				.set('Authorization', `Bearer ${jestAdminToken}`)

		expect(res.statusCode).toBe(200)
		expect(res.body.data).toHaveLength(1)
	});
});

describe("Test 5: End-to-end user test", () => {
	let testUserID
	// POST test user to /register
	it("T5-1. POST test user /register", async () => {
		const res =
			await request(app)
				.post('/api/users/register')
				.send({
					username : "Jest User",
					email : "test@fruitbowl.test",
					password : "test"
				})

		expect(res.statusCode).toBe(200)
	});
	// POST test user to /login
	it("T5-2. POST test user /login", async () => {
		const res =
			await request(app)
				.post('/api/users/login')
				.send({
					username : "Jest User",
					email : "test@fruitbowl.test",
					password : "test"
				})

		expect(res.statusCode).toBe(200)
	});
	// GET test user
	it("T5-3. GET test user by username", async () => {
		const res =
			await request(app)
				.get('/api/users?by=username&query=Jest User')
				.set('Authorization', `Bearer ${jestAdminToken}`)

		// console.log("T5-3. res body :", res.body)
		testUserID = res.body.data[0]._id
		expect(res.body.data[0].username).toBe("Jest User")
		expect(res.statusCode).toBe(200)
	});
	// PUT test user
	it("T5-4. PUT test user update", async () => {
		const res =
			await request(app)
				.put(`/api/users/id/${testUserID}`)
				.set('Authorization', `Bearer ${jestAdminToken}`)
				.send({
					username: "Test User Update",
				})

		// console.log("T5-4. res body :", res)
		// console.log("T5-4. res msg :", res.error)
		expect(res.statusCode).toBe(201)
		expect(res.body.data.username).toBe("Test User Update")
	})
	// GET test user with sort
	it("T5-5. GET test user using AppID sort, direction, and limit", async () => {
		const res =
			await request(app)
				.get('/api/users?sort=updatedAt&direction=-1&limit=1')
				.set('Authorization', `Bearer ${jestAdminToken}`)

		// console.log("T5-5 res body: ", res.body)
		expect(res.body.data[0].username).toBe("Test User Update")
		expect(res.statusCode).toBe(200)
	});
	// DEL test user
	it("T5-6. DELETE test user", async () => {
		const res =
			await request(app)
				.delete(`/api/users/id/${testUserID}`)
				.set('Authorization', `Bearer ${jestAdminToken}`)

		// console.log("T5-6 res: ", res.body)
		expect(res.statusCode).toBe(200)
	})
})
