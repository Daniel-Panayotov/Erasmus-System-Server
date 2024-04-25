const jwtHelper = require('../utils/jwtHelper');

async function auth(req, res, next) {
	const { authcookie } = req.headers;
	let isValidToken = false;

	try {
		// verify if exists
		if (authcookie) {
			//returns token
			isValidToken = await jwtHelper.verifyAsync(authcookie);
		}
	} catch (err) {
		console.log(err);
	}

	req.isLoggedToken = isValidToken;

	next();
}

function isLogged(req, res, next) {
	const isLogged = req.isLoggedToken;

	if (!isLogged) {
		res.send('user isnt logged');
	} else {
		next();
	}
}

function isNOTLogged(req, res, next) {
	const isLogged = req.isLoggedToken;

	if (isLogged) {
		res.send('user is already logged');
	} else {
		next();
	}
}

function isAdmin(req, res, next) {
	const isLoggedToken = req.isLoggedToken;

	//check if token exists and if it has admin: true
	if (!isLoggedToken.admin) {
		res.send('not an admin');
	} else {
		next();
	}
}

module.exports = { auth, isLogged, isNOTLogged, isAdmin };
