const router = require('express').Router();
const foreignContactsManager = require('../managers/ForeignContactManager');
const errorHelper = require('../utils/errorHelper');
const { isAdmin, isLogged } = require('../middlewares/authMiddleWare');
const { contactsRegex, globalRegex, facultyRegex } = require('../config/regex');

const generalHelper = require('../utils/generalHelper');
const mongoose = require('mongoose');

/* POST */

router.post('/getAll', isLogged, async (req, res) => {
	try {
		const docs = await foreignContactsManager.getAll();
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

		const docs = await foreignContactsManager.getForPage(skip);
		const docCount = await foreignContactsManager.getCount();
		res.send({ docs, docCount });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

router.post('/getPageByParam/:page', isAdmin, async (req, res) => {
	let { select, search } = req.body;
	const page = req.params.page;

	search = mongoose.sanitizeFilter(search);
	try {
		if (!parseInt(page)) {
			throw new Error('Invalid page');
		}
		if (!contactsRegex.select.exec(select)) {
			throw new Error('Invalid select');
		}

		const skip = generalHelper.calcSkip(page);

		const docs = await foreignContactsManager.findPageByParam(select, search, skip);
		const docCount = await foreignContactsManager.getCountByParam(select, search);
		res.send({ docs, docCount });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

router.post('/createOne', isAdmin, async (req, res) => {
	let { firstName, lastName, email, phone, faculty } = req.body;

	try {
		const fieldExists = await foreignContactsManager.findExisting(email);

		if (fieldExists[0]) {
			throw new Error('This contact already exists');
		}

		const doc = await foreignContactsManager.addForeignContact({
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

		const fieldExists = await foreignContactsManager.findExisting(email, id);

		if (fieldExists[0]) {
			throw new Error('This Contact already exists');
		}

		const doc = await foreignContactsManager.updateOneById(id, {
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

		const doc = await foreignContactsManager.deleteOneById(id);
		res.send({ doc });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

module.exports = router;
