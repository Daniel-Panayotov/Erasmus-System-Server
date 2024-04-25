const ReceivingContact = require('../models/ReceivingContact');

function findExisting(email, id) {
	if (!id) {
		return ReceivingContact.find({ email });
	}
	return ReceivingContact.find({ email }).ne('_id', id);
}

function findPageByParam(select, search, skip) {
	//match case-insensitive regex and sort
	if (select == 'faculty') {
		return ReceivingContact.find({ [select]: { $in: search } })
			.sort({
				[select]: 'asc',
			})
			.limit(10)
			.skip(skip)
			.populate('faculty');
	} else {
		return ReceivingContact.find({ [select]: { $regex: search, $options: 'i' } })
			.sort({
				[select]: 'asc',
			})
			.limit(10)
			.skip(skip)
			.populate('faculty');
	}
}

function getForPage(skip) {
	return ReceivingContact.find().sort({ code: 'asc' }).limit(10).skip(skip).populate('faculty');
}

function addForeignContact(data) {
	return ReceivingContact.create(data);
}

function updateOneById(id, data) {
	return ReceivingContact.findByIdAndUpdate(id, data);
}

function deleteOneById(id) {
	return ReceivingContact.findByIdAndDelete(id);
}

function getCount() {
	return ReceivingContact.countDocuments();
}

function getCountByParam(select, search) {
	if (select == 'faculty') {
		return ReceivingContact.countDocuments({ [select]: { $in: search } }).setOptions({
			sanitizeFilter: true,
		});
	}
	//search by regex of string
	return ReceivingContact.countDocuments({
		[select]: { $regex: search, $options: 'i' },
	}).setOptions({ sanitizeFilter: true });
}

function getAll() {
	return ReceivingContact.find().populate('faculty');
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
