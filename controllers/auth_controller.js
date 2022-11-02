//// Router -> User / Game Controller Middleware ////

const loginRequired = (req, res, next) => {
	// If the user exists, move on
	if(req.user){
		console.log("req.user = ", req.user)
		next()
	}
	// Else if the user doesn't exist
	else{
		// Respond with a status 401: Unauthorized...
		return res.status(401).json({
			// ...and return this message
			message: 'Unauthorized user!'
		})
	}
}

const adminRequired = (req, res, next) => {
	// If the user is an admin, move on
	if(req.user && req.user.role === 'admin'){
		console.log("req.user = ", req.user)
		next()
	}
	// Else if the user isn't an admin
	else{
		// Respond with a status 401: Unauthorized...
		return res.status(401).json({
			// ...and return this message
			message: 'Not an admin!'
		})
	}
}

module.exports = {
	loginRequired,
	adminRequired
};