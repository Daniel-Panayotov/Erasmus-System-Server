const router = require('express').Router();
const errorHelper = require('../utils/errorHelper');
const jwtHelper = require('../utils/jwtHelper');
const adminManager = require('../managers/adminManager');
const { globalRegex } = require('../config/regex');

router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		// check if fields are filled
		if (!globalRegex.emailRegex.exec(email) || password.length < 10 || password.length > 30) {
			throw new Error('Fields must be filled');
		}

		// attempt login
		const admin = await adminManager.loginAdmin({ email, password });
		const { _id, email: emailJwt } = admin;

		// get jwt and set admin: true
		const jwt = await jwtHelper.signAsync({ _id, emailJwt, admin: true });

		res.send({ jwt });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

module.exports = router;
