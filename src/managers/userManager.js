const User = require('../models/User');
const { comparePass } = require('../utils/bcryptHelper');

function register(data) {
	return User.create(data);
}

async function login(data) {
	const { email, password } = data;

	const user = await User.findOne({ email }).lean();
	if (!user) {
		throw new Error('Wrong credentials');
	}

	const isValid = await comparePass(password, user.password);
	if (!isValid) {
		throw new Error('Wrong credentials');
	}

	return user;
}

function getOneByParam(param) {
	return User.findOne({ ...param }, { password: 0 });
}

module.exports = { register, login, getOneByParam };
