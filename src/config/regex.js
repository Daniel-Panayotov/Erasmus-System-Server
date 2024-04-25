const globalRegex = {
	docId: /^[a-fA-F0-9]{24}$/,
	//potential attack
	emailRegex:
		/(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
	phoneNumber: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
	country: /^([a-zA-Z]{2,52})$/,
	year: /^([0-9]{4})$/,
	date: /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/((19|20)\d{2})$/,
	normalSentences: /^[a-zA-Z0-9 ,.!?'"(){}[\]:;-]{1,100}$/,
	word: /^(\w{1,20})$/,
};

const userDataRegex = {
	studyYears: /^(1[0-2]|[1-9])$/,
	priorStudyMonths: /^([1-2][0-9]|[0-9])$/,
};

const fieldsRegex = {
	formFieldNameSearch:
		/^([a-zA-Z\s]{1,50}(?:\d{1,3})?)|[0-9]{1,3}$/ /* 1-50 characters includes whitespaces, letters and diggits(only last, up to 3)*/,
	fieldName: /^[a-zA-Z\s]{4,50}(?:\d{1,3})?$/ /* identical, but matches 4-50 */,
	code: /^([0-9]{3})$/,
};

const facultyRegex = {
	personNames: /^[a-zA-Z\s]{1,20}$/,
	facultySearch:
		/^([a-zA-Z\s]{1,50}(?:\d{1,3})?)|[0-9]{1,3}$/ /* 1-50 characters includes whitespaces, letters and diggits(only last, up to 3)*/,
	facultyName: /^[a-zA-Z\s]{4,50}(?:\d{1,3})?$/ /* identical, but matches 4-50 */,
};

const contactsRegex = {
	personName: /^[a-zA-Z]{4,15}$/,
	personSearch: /^[a-zA-Z]{1,15}$/,
	select: /^(firstName|lastName|email|phone|faculty)$/,
};

const mobilitiesRegex = {
	code: /^([a-zA-Z0-9\s]{5,20})$/,
	university: /^([a-zA-Z0-9\s]{5,20})$/,
	count: /^(?:25[0-4]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
};

const applicationsRegex = {
	academicYear: /^(([0-9]{4}) - ([0-9]{4}))$/,
};

module.exports = {
	globalRegex,
	contactsRegex,
	fieldsRegex,
	facultyRegex,
	userDataRegex,
	mobilitiesRegex,
	applicationsRegex,
};
