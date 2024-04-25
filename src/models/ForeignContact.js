const mongoose = require('mongoose');
const { globalRegex, contactsRegex, facultyRegex } = require('../config/regex');

const ForeignContactSchema = new mongoose.Schema({
	firstName: {
		type: String,
		require: true,
		match: [contactsRegex.personName, 'Invalid Name'],
	},
	lastName: {
		type: String,
		require: true,
		match: [contactsRegex.personName, 'Invalid Name'],
	},
	email: {
		type: String,
		match: [globalRegex.emailRegex, 'Invalid email address'],
	},
	phone: {
		type: String,
		match: [globalRegex.phoneNumber, 'Invalid phone number'],
	},
	faculty: {
		type: String,
		match: [facultyRegex.facultyName, 'Invalid Faculty name'],
		required: true,
	},
});

ForeignContactSchema.pre('findOneAndUpdate', function (next) {
	this.setOptions({ runValidators: true });
	next();
});

const ForeignContant = mongoose.model('foreignContacts', ForeignContactSchema);

module.exports = ForeignContant;
