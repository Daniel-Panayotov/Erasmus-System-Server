const mongoose = require('mongoose');
const { globalRegex, facultyRegex, mobilitiesRegex } = require('../config/regex');

const MobilitySchema = new mongoose.Schema({
	code: {
		type: String,
		required: [true, 'Mobility code is required'],
		match: [mobilitiesRegex.code, 'Invalid mobility code'],
	},
	country: {
		type: String,
		required: [true, 'Country is required'],
		match: [globalRegex.country, 'Invalid country name'],
	},
	validFrom: {
		type: String,
		required: [true, 'Valid from date is required'],
		match: [globalRegex.date, 'Invalid date'],
	},
	validUntil: {
		type: String,
		required: [true, 'Valid until date required'],
		match: [globalRegex.date, 'Invalid date'],
	},
	university: {
		type: String,
		required: [true, 'University is required'],
		match: [mobilitiesRegex.university, 'Invalid mobility code'],
	},
	//hard to regex this
	address: {
		type: String,
		required: [true, 'Address is required'],
	},
	coordinator: {
		type: String,
		required: [true, 'Coordinator name is required'],
		match: [facultyRegex.personNames, 'Invalid Coordinator name'],
	},
	lectureCount: {
		type: String,
		required: [true, 'Lecture count is required'],
		match: [mobilitiesRegex.count, 'Lecture count must be 0-255'],
	},
	practiceCount: {
		type: String,
		required: [true, 'Practice lesson count is required'],
		match: [mobilitiesRegex.count, 'Practice count must be 0-255'],
	},
	subjectCodeRef: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'fieldsOfEducation',
		required: [true, 'Subject code is required'],
	},
	sendingContactRef: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'foreignContacts',
		required: [true, 'Sending contact is required'],
	},
	receivingContactRef: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'receivingContacts',
		required: [true, 'Receiving contact is required'],
	},
});

MobilitySchema.pre('findOneAndUpdate', function (next) {
	this.setOptions({ runValidators: true });
	next();
});

const Mobility = mongoose.model('mobilities', MobilitySchema);

module.exports = Mobility;
