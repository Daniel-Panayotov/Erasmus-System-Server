const mongoose = require('mongoose');
const { globalRegex, applicationsRegex } = require('../config/regex');

const ApplicationSchema = new mongoose.Schema({
	userRef: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: [true, 'User is required'],
	},
	form: {
		type: mongoose.SchemaTypes.Buffer,
		required: [true, 'A pdf form is required'],
	},
	status: {
		type: String,
		enum: ['approved', 'rejected', 'pending'],
		required: [true, 'Status for an application is required'],
	},
	academicYear: {
		type: String,
		match: [applicationsRegex.academicYear, 'Invalid year format: dd/mm/yyyy - dd/mm/yyyy'],
		required: [true, 'Academic year is required'],
	},
	note: {
		type: String,
		match: [globalRegex.normalSentences, 'Invalid note, you cant use special characters'],
	},
	approvedForm: {
		type: mongoose.SchemaTypes.Buffer,
	},
});

ApplicationSchema.pre('findOneAndUpdate', function (next) {
	this.setOptions({ runValidators: true });
	next();
});

const Application = mongoose.model('applications', ApplicationSchema);

module.exports = Application;
