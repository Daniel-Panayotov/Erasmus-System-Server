const router = require('express').Router();
const userManager = require('../managers/userManager');
const errorHelper = require('../utils/errorHelper');
const jwtHelper = require('../utils/jwtHelper');
const { isNOTLogged } = require('../middlewares/authMiddleWare');
const { hashPass } = require('../utils/bcryptHelper');
const { globalRegex } = require('../config/regex');
const mongoose = require('mongoose');

router.post('/register', isNOTLogged, async (req, res) => {
	let { email, password } = req.body;

	try {
		//sanitize and validate
		password = mongoose.sanitizeFilter(password);
		if (!globalRegex.emailRegex.exec(email) || password.length < 10 || password.length > 30) {
			throw new Error('Invalaid name or password');
		}

		// check if email is registered
		const userExists = await userManager.getOneByParam({ email });

		if (userExists) {
			throw new Error('User already exists');
		}

		//encrypt password
		const hashedPassword = await hashPass(password, 6);

		// register
		const user = await userManager.register({ email, password: hashedPassword });
		const { _id, email: emailJwt } = user;

		// get jwt
		const jwt = await jwtHelper.signAsync({ _id, emailJwt });

		res.send({ jwt });
	} catch (err) {
		// get one error from many possible
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

router.post('/login', isNOTLogged, async (req, res) => {
	let { email, password } = req.body;

	try {
		// sanitize and validate
		password = mongoose.sanitizeFilter(password);
		if (!globalRegex.emailRegex.exec(email) || password.length < 10 || password.length > 30) {
			throw new Error('Invalid email or password');
		}

		// attempt login
		const user = await userManager.login({ email, password });
		const { _id, email: emailJwt } = user;

		// get jwt
		const jwt = await jwtHelper.signAsync({ _id, emailJwt });

		res.send({ jwt });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

router.post('/verify-cookie', (req, res) => {
	const cookie = req.isLoggedToken;
	let isAuthenticated = false;
	let isAdmin = false;

	if (cookie) {
		isAuthenticated = true;
		isAdmin = cookie.admin ? true : false;
	}

	res.send({ isAuthenticated, isAdmin });
});

module.exports = router;
