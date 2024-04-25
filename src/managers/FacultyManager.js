const Faculty = require('../models/Faculty');

function findExisting(name, id) {
	if (!id) {
		return Faculty.find({ name });
	}
	return Faculty.find({ name }).ne('_id', id);
}

function getForPage(skip) {
	return Faculty.find().sort({ name: 'asc' }).limit(10).skip(skip);
}

function findByParam(select, search, skip) {
	//match case-insensitive regex and sort
	return Faculty.find({ [select]: { $regex: search, $options: 'i' } })
		.sort({
			[select]: 'asc',
		})
		.limit(10)
		.skip(skip);
}

function addFaculty(data) {
	return Faculty.create(data);
}

function updateOneById(id, data) {
	return Faculty.findByIdAndUpdate(id, data);
}

function deleteOneById(id) {
	return Faculty.findByIdAndDelete(id);
}

function getCount() {
	return Faculty.countDocuments();
}

function getCountByParam(select, search) {
	return Faculty.countDocuments({ [select]: { $regex: search, $options: 'i' } });
}

function getAll() {
	return Faculty.find();
}

module.exports = {
	getForPage,
	findByParam,
	addFaculty,
	updateOneById,
	deleteOneById,
	getCount,
	getCountByParam,
	findExisting,
	getAll,
};
