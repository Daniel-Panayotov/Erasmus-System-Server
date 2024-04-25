const mongoose = require('mongoose');
const { globalRegex } = require('../config/regex');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, 'Email is required'],
		match: [globalRegex.emailRegex, 'Invalid email'],
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minLength: [10, 'Password must be at least 10 characters'],
	},
});

UserSchema.pre('findOneAndUpdate', function (next) {
	this.setOptions({ runValidators: true });
	next();
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
