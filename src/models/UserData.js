const mongoose = require('mongoose');
const { globalRegex, contactsRegex, facultyRegex, userDataRegex } = require('../config/regex');

const userData = new mongoose.Schema({
	userRef: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'users',
		required: [true, 'User is required'],
	},
	firstName: {
		type: String,
		match: [contactsRegex.personName, 'Invalid first name'],
		required: [true, 'First name is required'],
	},
	lastName: {
		type: String,
		match: [contactsRegex.personName, 'Invalid last name'],
		required: [true, 'Last name is required'],
	},
	birthDate: {
		type: String,
		required: [true, 'Birth date is required'],
		match: [globalRegex.date, 'Invalid date'],
	},
	sex: {
		type: String,
		enum: ['female', 'male'],
		required: [true, 'Sex is required'],
	},
	birthPlace: {
		type: String,
		required: [true, 'You need to have a place of birth'],
		match: [globalRegex.country, 'Invalid place of birth'],
	},
	nationality: {
		type: String,
		required: [true, 'You need to have a nationality'],
		match: [globalRegex.country, 'Invalid nationality'],
	},
	address: {
		type: String,
		required: [true, 'You need to have an address'],
		match: [globalRegex.normalSentences, 'Invalid address'],
	},
	phone: {
		type: String,
		required: [true, 'You need to have a phone'],
		match: [globalRegex.phoneNumber, 'Invalid nationality'],
	},
	academicYearFrom: {
		type: String,
		required: [true, 'You need to have an academic year'],
		match: [globalRegex.year, 'Invalid year'],
	},
	academicYearTo: {
		type: String,
		required: [true, 'You need to have an academic year'],
		match: [globalRegex.year, 'Invalid year'],
	},
	mobilityType: {
		type: String,
		enum: ['study', 'traineeship'],
		required: [true, 'You need to have a mobility type'],
	},
	semesterSeason: {
		type: String,
		enum: ['summer', 'winter', 'year'],
		required: [true, 'We must know the season of your semester'],
	},
	fieldOfStudyRef: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'fieldsOfEducation',
		required: [true, 'You must have a field of study'],
	},
	mobilityRef: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'mobilities',
		required: [true, 'A mobility is required'],
	},
	sendingContactRef: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'foreignContacts',
		required: false,
	},
	sendingFaculty: {
		type: String,
		required: [true, 'You must have a contact'],
		match: [facultyRegex.facultyName, 'Invalid faculty name'],
	},
	receivingFacultyRef: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'faculties',
		required: [true, 'You must have a receiving faculty'],
	},
	receivingContactRef: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'receivingContacts',
		required: false,
	},
	studyFrom: {
		type: String,
		required: [true, 'Starting study date is required'],
		match: [globalRegex.date, 'Invalid date'],
	},
	studyTo: {
		type: String,
		required: [true, 'Ending study date is required'],
		match: [globalRegex.date, 'Invalid date'],
	},
	accommodation: {
		type: Boolean,
		required: [true, 'Accommodation preferences are required'],
	},
	stayFrom: {
		type: String,
		required: [true, 'Period of stay required'],
		match: [globalRegex.date, 'Invalid date'],
	},
	stayTo: {
		type: String,
		required: [true, 'Period of stay required'],
		match: [globalRegex.date, 'Invalid date'],
	},
	bulgarianCourse: {
		type: Boolean,
		required: [true, 'Attending status required'],
	},
	visitReason: {
		type: String,
		required: [true, 'Visit reason required'],
		match: [globalRegex.normalSentences, 'Invalid symbols'],
	},
	motherLanguage: {
		type: String,
		required: [true, 'Mother language is required'],
		match: [globalRegex.word, 'Invalid language'],
	},
	homeLanguage: {
		type: String,
		required: false,
		match: [globalRegex.word, 'Invalid language'],
	},
	studyDegree: {
		type: String,
		enum: ['Bachelor', 'Master'],
		required: [true, 'Studying degree required'],
	},
	studyYears: {
		type: String,
		required: [true, 'Study years required'],
		match: [userDataRegex.studyYears, 'Number between 1 - 12'],
	},
	priorStudyErasmus: {
		type: Boolean,
		required: [true, 'Prior study status required'],
	},
	priorStudyMonths: {
		type: String,
		required: [true, 'Prior study months required'],
		match: [userDataRegex.priorStudyMonths, 'Number between 0-20'],
	},
});

userData.static('giveAll', () => {
	return this.find();
});

userData.pre('findOneAndUpdate', function (next) {
	this.setOptions({ runValidators: true });
	next();
});

const UserData = mongoose.model('userData', userData);

module.exports = UserData;
