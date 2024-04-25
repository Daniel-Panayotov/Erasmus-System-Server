const bcrypt = require('bcrypt');

function hashPass(password, rounds) {
	return bcrypt.hash(password, rounds);
}

function comparePass(password, hashedPassword) {
	return bcrypt.compare(password, hashedPassword);
}

module.exports = { hashPass, comparePass };
