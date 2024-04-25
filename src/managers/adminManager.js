const Admin = require('../models/Admin');
const { comparePass } = require('../utils/bcryptHelper');

async function loginAdmin(data) {
	const { email, password } = data;

	const admin = await Admin.findOne({ email }).lean();
	if (!admin) {
		throw new Error('Wrong credentials');
	}

	const isValid = await comparePass(password, admin.password);
	if (!isValid) {
		throw new Error('Wrong credentials');
	}

	return admin;
}

module.exports = { loginAdmin };
