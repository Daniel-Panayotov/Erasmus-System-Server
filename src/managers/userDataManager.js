const UserData = require('../models/UserData');

function getAll() {
	return UserData.find().populate(
		[
			'userRef',
			'fieldOfStudyRef',
			'mobilityRef',
			'sendingContactRef',
			'receivingFacultyRef ',
			'receivingContactRef',
		],
		'-password',
	);
}

function findExistingOrNotEqualToId(data, id) {
	if (!id) {
		return UserData.find({ ...data });
	}
	return UserData.find({ ...data }).ne('_id', id);
}

function getForPage(skip) {
	return UserData.find()
		.populate(
			[
				'userRef',
				'fieldOfStudyRef',
				'mobilityRef',
				'sendingContactRef',
				'receivingFacultyRef ',
				'receivingContactRef',
			],
			'-password',
		)
		.sort({ nationality: 'asc' })
		.limit(10)
		.skip(skip);
}

function getPageByParam(select, search, skip) {
	return UserData.find({ [select]: { $regex: search, $options: 'i' } })
		.populate(
			[
				'userRef',
				'fieldOfStudyRef',
				'mobilityRef',
				'sendingContactRef',
				'receivingFacultyRef ',
				'receivingContactRef',
			],
			'-password',
		)
		.sort({
			[select]: 'asc',
		})
		.limit(10)
		.skip(skip);
}

function create(data) {
	return UserData.create(data);
}

function updateOneById(id, data) {
	return UserData.findByIdAndUpdate(id, data);
}

function deleteOneById(id) {
	return UserData.findByIdAndDelete(id);
}

function getCount() {
	return UserData.countDocuments();
}

function getCountByParam(select, search) {
	return UserData.countDocuments({ [select]: { $regex: search, $options: 'i' } });
}

module.exports = {
	findExistingOrNotEqualToId,
	getAll,
	getForPage,
	getPageByParam,
	create,
	updateOneById,
	deleteOneById,
	getCount,
	getCountByParam,
};
