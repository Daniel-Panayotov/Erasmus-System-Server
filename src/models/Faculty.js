const mongoose = require('mongoose');
const { facultyRegex } = require('../config/regex');

const FacultySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Faculty name is required'],
		minLength: [4, 'Faculty name cant be less than 3 characters long'],
		maxLength: [50, 'Faculty name must be within 50 characters'],
		match: [facultyRegex.facultyName, 'Invalid faculty name'],
	},
	coordinator: {
		type: String,
		required: [true, 'Coordinator is required'],
		minLength: [4, 'Coordinator name cant be less than 3 characters long'],
		maxLength: [20, 'Coordinator name must be within 20 characters'],
		match: [facultyRegex.personNames, 'Name can contain only letters and whitespaces'],
	},
});

FacultySchema.pre('findOneAndUpdate', function (next) {
	this.setOptions({ runValidators: true });
	next();
});

const Faculty = mongoose.model('faculties', FacultySchema);

module.exports = Faculty;
