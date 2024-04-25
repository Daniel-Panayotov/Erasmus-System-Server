const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { secret } = require('../config/secret');

function sign(secret, options, payload) {
	return promisify(jwt.sign)(payload, secret, options);
}
function verify(secret, token) {
	return promisify(jwt.verify)(token, secret);
}

const signAsync = sign.bind(this, secret, { expiresIn: '24h' });
const verifyAsync = verify.bind(this, secret);

module.exports = { signAsync, verifyAsync };
