const mongoose = require('mongoose');
const { globalRegex } = require('../config/regex');

const AdminSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, 'Email is required'],
		match: [globalRegex.emailRegex, 'Invalid email'],
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minLength: [10, 'Password not long enough'],
	},
});

AdminSchema.pre('findOneAndUpdate', function (next) {
	this.setOptions({ runValidators: true });
	next();
});

const Admin = mongoose.model('admins', AdminSchema);

module.exports = Admin;
