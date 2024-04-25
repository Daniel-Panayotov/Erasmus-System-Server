const Mobility = require('../models/Mobility');

function findExistingOrNotEdualToId(data, id) {
	if (!id) {
		return Mobility.find({ ...data });
	}
	return Mobility.find({ ...data }).ne('_id', id);
}

function getAll() {
	return Mobility.find().populate(['subjectCodeRef', 'sendingContactRef', 'receivingContactRef']);
}

function getForPage(skip) {
	return Mobility.find()
		.populate(['subjectCodeRef', 'sendingContactRef', 'receivingContactRef'])
		.sort({ code: 'asc' })
		.limit(10)
		.skip(skip);
}

function getPageByParam(select, search, skip) {
	return Mobility.find({ [select]: { $regex: search, $options: 'i' } })
		.populate(['subjectCodeRef', 'sendingContactRef', 'receivingContactRef'])
		.sort({
			[select]: 'asc',
		})
		.limit(10)
		.skip(skip);
}

function createOne(data) {
	return Mobility.create(data);
}

function updateOneById(id, data) {
	return Mobility.findByIdAndUpdate(id, data);
}

function deleteOneById(id) {
	return Mobility.findByIdAndDelete(id);
}

function getCount() {
	return Mobility.countDocuments();
}

function getCountByParam(select, search) {
	return Mobility.countDocuments({ [select]: { $regex: search, $options: 'i' } });
}

module.exports = {
	findExistingOrNotEdualToId,
	getAll,
	getForPage,
	getPageByParam,
	createOne,
	updateOneById,
	deleteOneById,
	getCount,
	getCountByParam,
};
