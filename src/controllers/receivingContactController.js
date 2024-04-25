const router = require('express').Router();
const receivingContactManager = require('../managers/receivingContactManager');
const facultiesManager = require('../managers/FacultyManager');
const errorHelper = require('../utils/errorHelper');
const { isAdmin, isLogged } = require('../middlewares/authMiddleWare');
const { contactsRegex, globalRegex, facultyRegex } = require('../config/regex');
const generalHelper = require('../utils/generalHelper');

/* POST */

router.post('/getAll', isLogged, async (req, res) => {
	try {
		const docs = await receivingContactManager.getAll();
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
			throw new Error('Wrong params');
		}
		//get all
		const skip = generalHelper.calcSkip(page);

		const docs = await receivingContactManager.getForPage(skip);
		const docCount = await receivingContactManager.getCount();
		res.send({ docs, docCount });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

router.post('/getPageByParam/:page', isAdmin, async (req, res) => {
	let { select, search } = req.body;
	const page = req.params.page;

	try {
		if (!parseInt(page)) {
			throw new Error('Invalid page');
		}
		if (!contactsRegex.select.exec(select)) {
			throw new Error('Invalid select');
		}

		if (select == 'faculty' && facultyRegex.facultySearch.exec(search)) {
			const faculties = await facultiesManager.findExisting(search);
			search = faculties.map(val => {
				return val._id.toString();
			});
		}

		const skip = generalHelper.calcSkip(page);

		const docs = await receivingContactManager.findPageByParam(select, search, skip);
		const docCount = await receivingContactManager.getCountByParam(select, search);
		res.send({ docs, docCount });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

router.post('/createOne', isAdmin, async (req, res) => {
	let { firstName, lastName, email, phone, faculty } = req.body;

	try {
		const fieldExists = await receivingContactManager.findExisting(email);

		if (fieldExists[0]) {
			throw new Error('This contact already exists');
		}

		const facultyDoc = await facultiesManager.findExisting(faculty);
		if (!facultyDoc[0]) throw new Error('Invalid faculty');
		faculty = facultyDoc[0]._id;

		const doc = await receivingContactManager.addForeignContact({
			firstName,
			lastName,
			email,
			phone,
			faculty,
		});
		res.send({ doc });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(409).send({ message });
	}
});

/* PATCH */

router.patch('/updateOne/:id', isAdmin, async (req, res) => {
	let { firstName, lastName, email, phone, faculty } = req.body;
	const id = req.params.id;

	try {
		if (!globalRegex.docId.exec(id)) {
			throw new Error('Invalid id');
		}

		const fieldExists = await receivingContactManager.findExisting(email, id);

		if (fieldExists[0]) {
			throw new Error('This Contact already exists');
		}

		const facultyDoc = await facultiesManager.findExisting(faculty);
		if (!facultyDoc[0]) throw new Error('Invalid faculty');
		faculty = facultyDoc[0]._id;

		const doc = await receivingContactManager.updateOneById(id, {
			firstName,
			lastName,
			email,
			phone,
			faculty,
		});
		res.send({ doc });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(409).send({ message });
	}
});

/* DELETE */

router.delete('/deleteOne/:id', isAdmin, async (req, res) => {
	const id = req.params.id;

	try {
		if (!globalRegex.docId.exec(id)) {
			throw new Error('Invalid id');
		}

		const doc = await receivingContactManager.deleteOneById(id);
		res.send({ doc });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

module.exports = router;
