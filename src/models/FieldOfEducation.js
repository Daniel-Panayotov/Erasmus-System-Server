const mongoose = require('mongoose');
const { fieldsRegex } = require('../config/regex');

const FieldOfEducationSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A field must have a name'],
		match: [fieldsRegex.fieldName, 'Field name must be 4-50 chars'],
	},
	code: {
		type: String,
		required: [true, 'A field must have a code'],
		match: [fieldsRegex.code, 'Code must be 3 chars'],
	},
});

FieldOfEducationSchema.pre('findOneAndUpdate', function (next) {
	this.setOptions({ runValidators: true });
	next();
});

const FieldOfEducation = mongoose.model('fieldsOfEducation', FieldOfEducationSchema);

module.exports = FieldOfEducation;
