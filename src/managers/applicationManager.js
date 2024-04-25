const Application = require('../models/Application');

function findExistingOrNotEqualToId(data, id) {
	if (!id) {
		return Application.find({ ...data });
	}
	return Application.find({ ...data }).ne('_id', id);
}

function getForPage(skip) {
	return Application.find()
		.populate('userRef', '-password')
		.sort({ status: 'asc' })
		.limit(10)
		.skip(skip)
		.lean();
}

function getPageByParam(select, search, skip) {
	return Application.find({ [select]: { $regex: search, $options: 'i' } })
		.populate('userRef', '-password')
		.sort({
			[select]: 'asc',
		})
		.limit(10)
		.skip(skip)
		.lean();
}

function createOne(data) {
	return Application.create(data);
}

function updateOneById(id, data) {
	return Application.findByIdAndUpdate(id, data);
}

function deleteOneById(id) {
	return Application.findByIdAndDelete(id);
}

function getCount() {
	return Application.countDocuments();
}

function getCountByParam(select, search) {
	return Application.countDocuments({ [select]: { $regex: search, $options: 'i' } });
}

module.exports = {
	findExistingOrNotEqualToId,
	getForPage,
	getPageByParam,
	createOne,
	updateOneById,
	deleteOneById,
	getCount,
	getCountByParam,
};
