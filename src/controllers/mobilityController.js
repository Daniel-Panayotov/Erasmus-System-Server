const router = require('express').Router();
const errorHelper = require('../utils/errorHelper');
const generalHelper = require('../utils/generalHelper');
const mobilityManager = require('../managers/mobilityManager');
const fieldOfEducationManager = require('../managers/FieldOfEducationManager');
const receivingContactManager = require('../managers/receivingContactManager');
const foreignContactManager = require('../managers/ForeignContactManager');
const { isAdmin, isLogged } = require('../middlewares/authMiddleWare');
const { globalRegex } = require('../config/regex');

/* POST */

router.post('/getAll', isLogged, async (req, res) => {
	try {
		const docs = await mobilityManager.getAll();
		res.send({ docs });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

router.post('/getPage/:page', isAdmin, async (req, res) => {
	const page = req.params.page;
	try {
		if (!parseInt(page)) {
			throw new Error('Wrong page');
		}

		const skip = generalHelper.calcSkip(page);

		const docs = await mobilityManager.getForPage(skip);
		const docCount = await mobilityManager.getCount();
		res.send({ docs, docCount });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

router.post('/getPageByParam/:page', isAdmin, async (req, res) => {
	const { select, search } = req.body;
	const page = req.params.page;

	try {
		if (!parseInt(page)) {
			throw new Error('Wrong page');
		}

		const skip = generalHelper.calcSkip(page);

		const docs = await mobilityManager.getPageByParam(select, search, skip);
		const docCount = await mobilityManager.getCountByParam(select, search);
		res.send({ docs, docCount });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

router.post('/createOne', isAdmin, async (req, res) => {
	let {
		code,
		country,
		validFrom,
		validUntil,
		university,
		address,
		coordinator,
		lectureCount,
		practiceCount,
		subjectCodeRef,
		sendingContactRef,
		receivingContactRef,
	} = req.body;

	try {
		const existingMobilities = await mobilityManager.findExistingOrNotEdualToId({ code });
		if (existingMobilities[0]) throw new Error('This mobility exists');

		const subjectField = await fieldOfEducationManager.findExisting(subjectCodeRef);
		if (!subjectField[0]) throw new Error('Invalid subject field');
		subjectCodeRef = subjectField[0]._id;

		const receivingContact = await receivingContactManager.findExisting(receivingContactRef);
		if (!receivingContact[0]) throw new Error('Invalid receiving contact');
		receivingContactRef = receivingContact[0]._id;

		const sendingContact = await foreignContactManager.findExisting(sendingContactRef);
		if (!sendingContact[0]) throw new Error('Invalid sending contact');
		sendingContactRef = sendingContact[0]._id;

		const doc = await mobilityManager.createOne({
			code,
			country,
			validFrom,
			validUntil,
			university,
			address,
			coordinator,
			lectureCount,
			practiceCount,
			subjectCodeRef,
			sendingContactRef,
			receivingContactRef,
		});
		res.send({ doc });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

/* PATCH */

router.patch('/updateOne/:id', isAdmin, async (req, res) => {
	const id = req.params.id;
	let {
		code,
		country,
		validFrom,
		validUntil,
		university,
		address,
		coordinator,
		lectureCount,
		practiceCount,
		subjectCodeRef,
		sendingContactRef,
		receivingContactRef,
	} = req.body;

	try {
		if (!globalRegex.docId.exec(id)) throw new Error('invalid id');

		const existingMobilities = await mobilityManager.findExistingOrNotEdualToId({ code }, id);
		if (existingMobilities[0]) throw new Error('This code already exists');

		const subjectField = await fieldOfEducationManager.findExisting(subjectCodeRef);
		if (!subjectField[0]) throw new Error('Invalid subject field');
		subjectCodeRef = subjectField[0]._id;

		const receivingContact = await receivingContactManager.findExisting(receivingContactRef);
		if (!receivingContact[0]) throw new Error('Invalid receiving contact');
		receivingContactRef = receivingContact[0]._id;

		const sendingContact = await foreignContactManager.findExisting(sendingContactRef);
		if (!sendingContact[0]) throw new Error('Invalid sending contact');
		sendingContactRef = sendingContact[0]._id;

		const doc = await mobilityManager.updateOneById(id, {
			code,
			country,
			validFrom,
			validUntil,
			university,
			address,
			coordinator,
			lectureCount,
			practiceCount,
			subjectCodeRef,
			sendingContactRef,
			receivingContactRef,
		});
		res.send({ doc });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

/* DELETE */

router.delete('/deleteOne/:id', isAdmin, async (req, res) => {
	const id = req.params.id;

	try {
		if (!globalRegex.docId.exec(id)) throw new Error('invalid id');

		const doc = await mobilityManager.deleteOneById(id);
		res.send({ doc });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

module.exports = router;
