##### [Back: Development](3-Development.md)

<hr>

## Jest
- [Jest](https://jestjs.io) was used to write several unit tests for the API
- These tests included multiple GET requests to both users and games
- As well as end-to-end tests for both users and games

<hr>

## Jest script rundown
### Script import requirements:
- Requires supertest library (for running HTTP requests)
- Requires app.js which had to be made from most of the logic in server.js
- Required db.js + making disconnect function in db.js and minor alterations to connect function

### Script logic flow:
#### Before all tests...
1. Connect to MongoDB database
2. Register a new admin user in the users collection
3. Login as the new user to acquire token
4. Assign some user information to variables in outer scope
   - Admin token required for most other tests

### Test 1: GET request to root ('/')
1. GET request with no query parameters
   - Expects a status code response of 200: OK
   - Expects the response body to contain 'Welcome to Fruity Steam API!'

### Test 2: GET requests to games root ('/games')
1. GET request with no query parameters
   - Expects a status code of 200: OK
   - Expects the data array in the response body to have 100 games in it (default)
2. GET request with "limit=1" query parameter
   - Expects a status code of 200: OK
   - Expects the data array in the response body to have 1 game in it (limit)
3. GET request with "limit=1000" query parameter
    - Expects a status code of 200: OK
    - Expects the data array in the response body to have 1000 games in it (limit)

### Test 3: End-to-end game test
1. POST test game
    - Expects a status code of 201: Created
2. GET test game by AppID
    - Expects a status code of 200: OK
    - Expects first item in the response body data array to have the correct AppID
3. PUT test game update
    - Expects a status code of 201: Created
    - Expects the price of the game to match the updated price
4. GET test game using AppID w/ sort & limit
    - Expects a status code of 200: OK
    - Expects first item in the response body data array to match the updated name
5. DELETE test game
    - Expects a status code of 200: OK

### Test 4: GET requests to user root ('/users')
1. GET request with no query parameters
    - Expects a status code of 200: OK
2. GET request with "limit=1" query parameter
    - Expects a status code of 200: OK
    - Expects the data array in the response body to have 1 user in it (limit)

### Test 5: End-to-end user test
1. POST test user (register)
    - Expects a status code of 200: OK
2. POST test user (login)
    - Expects a status code of 200: OK
3. GET test user by username
    - Expects a status code of 200: OK
    - Expects first item in the response body data array to have the correct username
4. PUT test user update
    - Expects a status code of 201: Created
    - Expects the username in the response body data to match the request
5. GET test user using AppID w/ sort, direction, and limit
    - Expects a status code of 200: OK
    - Expects first item in the response body data array to match the updated username
6. DELETE test user
    - Expects a status code of 200: OK

### After all tests...
1. Delete jest admin from database
2. Disconnect from MongoDB

<hr>

## Loads of guides / StackOverflow pages used!
- https://jestjs.io/docs/testing-frameworks
- https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/ *(Useful)*
- https://zellwk.com/blog/jest-and-mongoose/
- https://jestjs.io/docs/mongodb
- https://jestjs.io/docs/tutorial-async
- https://www.makeuseof.com/express-apis-jest-test/
- https://stackoverflow.com/questions/49603939/message-async-callback-was-not-invoked-within-the-5000-ms-timeout-specified-by
- https://dev.to/nedsoft/testing-nodejs-express-api-with-jest-and-supertest-1km6
- https://plainenglish.io/blog/unit-testing-node-js-mongoose-using-jest-106a39b8393d
- https://stackoverflow.com/questions/53406347/jest-mock-express-jwt-middleware-behavior-for-protected-routes
- https://stackoverflow.com/questions/69794934/set-an-authentication-token-in-a-request-header-when-using-supertest-with-jest-a
- https://codeburst.io/unit-test-token-verification-for-auth0-using-jest-and-mock-jwks-2c8488df97d6
- https://stackoverflow.com/questions/73461823/jest-with-inversify-and-mongoose
- https://www.freecodecamp.org/news/how-to-test-in-express-and-mongoose-apps/ *(V. Useful)*
- https://medium.com/@palrajesh/nodejs-restful-api-testing-with-jest-and-supertest-490d636fe71

<hr>

##### [Next: Tools Used](5-ToolsUsed.md)
