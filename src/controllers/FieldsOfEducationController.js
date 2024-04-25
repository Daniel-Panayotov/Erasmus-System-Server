const router = require('express').Router();
const errorHelper = require('../utils/errorHelper');
const { isAdmin, isLogged } = require('../middlewares/authMiddleWare');
const fieldOfEducationManager = require('../managers/FieldOfEducationManager');
const { globalRegex } = require('../config/regex');
const generalHelper = require('../utils/generalHelper');

/* POST */

router.post('/getAll', isLogged, async (req, res) => {
	try {
		const docs = await fieldOfEducationManager.getAll();
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
		//get all
		const skip = generalHelper.calcSkip(page);

		const docs = await fieldOfEducationManager.getForPage(skip);
		const docCount = await fieldOfEducationManager.getCount();
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
		if ((select != 'code' && select != 'name') || !parseInt(page)) {
			throw new Error('Wrong params');
		}

		const skip = generalHelper.calcSkip(page);

		const docs = await fieldOfEducationManager.findByParam(select, search, skip);
		const docCount = await fieldOfEducationManager.getCountByParam(select, search);
		res.send({ docs, docCount });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

router.post('/create', isAdmin, async (req, res) => {
	const { name, code } = req.body;

	try {
		if (!parseInt(code) || code.length != 3) {
			throw new Error('Invalid code');
		}

		const fieldExists = await fieldOfEducationManager.findExisting(code, name);

		if (fieldExists[0]) {
			throw new Error('This code or name already exists');
		}

		//create and save the field
		const doc = await fieldOfEducationManager.addField({ name, code });
		res.send({ doc });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

/* PATCH */

router.patch('/updateOne/:id', isAdmin, async (req, res) => {
	let id = req.params.id;
	const { code, name } = req.body;

	try {
		if (!parseInt(code) || code.length != 3 || !globalRegex.docId.exec(id)) {
			throw new Error('Invalid code');
		}

		const fieldExists = await fieldOfEducationManager.findExisting(code, name, id);

		if (fieldExists[0]) {
			throw new Error('This code or name already exists');
		}

		//update
		const doc = await fieldOfEducationManager.updateOneById(id, { code, name });
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
		if (!globalRegex.docId.exec(id)) {
			throw new Error('Invalid id');
		}

		const doc = await fieldOfEducationManager.deleteOneById(id);
		res.send({ doc });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

module.exports = router;
