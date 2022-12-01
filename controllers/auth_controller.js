//// Router -> User / Game Controller Middleware ////

const loginRequired = (req, res, next) => {
	// If the user exists, move on
	if(req.user){
		console.log("req.user = ", req.user)
		next()
	}
	// Else if the user doesn't exist
	else{
		console.log(req)
		// If a GET request was made from '/'
		// Then it has to have come from games
		// (since user GET req to '/' would enter adminRequired function)
		if(req.route.path === '/' && req.route.methods.get){
			// console.log("GET REQUEST TO GAMES ROOT")
			// Respond with a status 401: Unauthorized...
			return res.status(401).json({
				// ...and return this message
				message: "Unauthorized user! Go to games/names if you really don't want to make an account!"
			})
		} else {
			// Respond with a status 401: Unauthorized...
			return res.status(401).json({
				// ...and return this message
				message: 'Unauthorized user!'
			})
		}
	}
}

const userRequired = (req, res, next ) => {
	// If user is an admin, move on
	if(req.user.role === 'admin'){
		next()
	}
	// Else if user's id matches the requested id, move on
	else if (req.user._id === req.params.id) {
		next();
	}
	// Else if neither of the above,
	else {
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
	adminRequired,
	userRequired
};
