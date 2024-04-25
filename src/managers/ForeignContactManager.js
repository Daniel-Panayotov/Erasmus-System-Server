const ForeignContant = require('../models/ForeignContact');

function findExisting(email, id) {
	if (!id) {
		return ForeignContant.find({ email });
	}
	return ForeignContant.find({ email }).ne('_id', id);
}

function findPageByParam(select, search, skip) {
	//match case-insensitive regex and sort

	return ForeignContant.find({ [select]: { $regex: search, $options: 'i' } })
		.sort({
			[select]: 'asc',
		})
		.limit(10)
		.skip(skip);
}

function getForPage(skip) {
	return ForeignContant.find().sort({ code: 'asc' }).limit(10).skip(skip);
}

function addForeignContact(data) {
	return ForeignContant.create(data);
}

function updateOneById(id, data) {
	return ForeignContant.findByIdAndUpdate(id, data);
}

function deleteOneById(id) {
	return ForeignContant.findByIdAndDelete(id);
}

function getCount() {
	return ForeignContant.countDocuments();
}

function getCountByParam(select, search) {
	return ForeignContant.countDocuments({
		[select]: { $regex: search, $options: 'i' },
	}).setOptions({ sanitizeFilter: true });
}

function getAll() {
	return ForeignContant.find();
}

module.exports = {
	findPageByParam,
	getForPage,
	addForeignContact,
	updateOneById,
	deleteOneById,
	getCount,
	getCountByParam,
	findExisting,
	getAll,
};
