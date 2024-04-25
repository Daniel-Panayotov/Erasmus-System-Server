const mongoose = require('mongoose');
const { globalRegex, contactsRegex } = require('../config/regex');

const ReceivingContactSchema = new mongoose.Schema({
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
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'faculties',
		required: true,
	},
});

ReceivingContactSchema.pre('findOneAndUpdate', function (next) {
	this.setOptions({ runValidators: true });
	next();
});

const ReceivingContant = mongoose.model('receivingContacts', ReceivingContactSchema);

module.exports = ReceivingContant;
