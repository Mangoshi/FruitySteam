// initialise express package as constant (import Express.js)
const express = require('express')
// initialise cors package as constant (import CORS library)
const cors = require('cors')
// import jsonwebtoken as 'jwt'
const jwt = require('jsonwebtoken')

// initialise dotenv package (environment variables)
require('dotenv').config()
// initialise db.js (import database config)
require('./utils/db').connectDB()

// initialise controller methods
const { registerUser, loginUser } = require('./controllers/user_controller');

// app is our instance of express
const app = express()
// app will use cors to solve CORs issues
app.use(cors())
// app will always use JSON
app.use(express.json())
// app will serve static files from /public
app.use(express.static('public'));

// defining middleware to run on requests prior to routing
app.use((req, res, next) => {
	// IF headers exist,
	// AND authorisation headers exists,
	// AND the first index of authorisation headers split (with <Space> character as a separator), is equal to 'Bearer'
	if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		// Using jsonwebtoken.verify to check if the second index of the authorisation-header split (the token) is valid
		// It checks this against our secret key, and then runs a callback function to see if everything went okay or not
		jwt.verify(req.headers.authorization.split(' ')[1],'steamedFruit', (error, decode) => {
			// if there's an error, set request.user to undefined
			if(error) req.user = undefined
			// otherwise, set request.user to equal the decoded version of the token (username/email/_id)
			req.user = decode
			// move on to the next thing (in this case it's routing, but it could be other middleware)
			next()
		})
	}
	// if not...
	else {
		// make request's user parameter undefined
		req.user = undefined
		// move on to routing
		next()
	}
})

//  Unauthenticated Routing  //
app.get('/', (req, res) => { res.json('Welcome to Fruity Steam API!') })
app.post('/register', registerUser)
app.post('/login', loginUser)

// API Routing //
app.use('/api/users', require('./routes/users'));
app.use('/api/games', require('./routes/games'));

module.exports = app;