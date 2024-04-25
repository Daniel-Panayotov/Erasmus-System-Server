const FieldOfEducation = require('../models/FieldOfEducation');

function findExisting(code, name, id) {
	if (!id) {
		return FieldOfEducation.find().or([{ code }, { name }]);
	}
	return FieldOfEducation.find().ne('_id', id).or([{ code }, { name }]);
}

function addField(data) {
	return FieldOfEducation.create(data);
}

function findByParam(select, search, skip) {
	//match case-insensitive regex and sort
	return FieldOfEducation.find({ [select]: { $regex: search, $options: 'i' } })
		.sort({
			[select]: 'asc',
		})
		.limit(10)
		.skip(skip);
}

function getForPage(skip) {
	return FieldOfEducation.find().sort({ code: 'asc' }).limit(10).skip(skip);
}

function updateOneById(id, data) {
	return FieldOfEducation.findByIdAndUpdate(id, data);
}

function deleteOneById(id) {
	return FieldOfEducation.findByIdAndDelete(id);
}

function getCount() {
	return FieldOfEducation.countDocuments();
}

function getCountByParam(select, search) {
	return FieldOfEducation.countDocuments({ [select]: { $regex: search, $options: 'i' } });
}

function getAll() {
	return FieldOfEducation.find();
}

module.exports = {
	addField,
	getForPage,
	updateOneById,
	deleteOneById,
	findByParam,
	getCount,
	getCountByParam,
	findExisting,
	getAll,
};
