const router = require('express').Router();
const facultyManager = require('../managers/FacultyManager');
const errorHelper = require('../utils/errorHelper');
const { isAdmin, isLogged } = require('../middlewares/authMiddleWare');
const { globalRegex, facultyRegex } = require('../config/regex');
const generalHelper = require('../utils/generalHelper');

/* POST */

router.post('/getAll', isLogged, async (req, res) => {
	try {
		const docs = await facultyManager.getAll();
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
		const skip = generalHelper.calcSkip(page);

		const docCount = await facultyManager.getCount();
		const docs = await facultyManager.getForPage(skip);
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
		if ((select != 'name' && select != 'coordinator') || !parseInt(page)) {
			throw new Error('Invalid params');
		}

		const skip = generalHelper.calcSkip(page);

		const docs = await facultyManager.findByParam(select, search, skip);
		const docCount = await facultyManager.getCountByParam(select, search);
		res.send({ docs, docCount });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

router.post('/createOne', isAdmin, async (req, res) => {
	const { name, coordinator } = req.body;

	try {
		const fieldExists = await facultyManager.findExisting(name);

		if (fieldExists[0]) {
			throw new Error('This name already exists');
		}

		const doc = await facultyManager.addFaculty({ name, coordinator });
		res.send({ doc });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(409).send({ message });
	}
});

/* PATCH */

router.patch('/updateOne/:id', isAdmin, async (req, res) => {
	const { name, coordinator } = req.body;
	const id = req.params.id;

	try {
		if (!globalRegex.docId.exec(id)) {
			throw new Error('Invalid id');
		}

		const fieldExists = await facultyManager.findExisting(name, id);

		if (fieldExists[0]) {
			throw new Error('This name already exists');
		}

		const doc = await facultyManager.updateOneById(id, { name, coordinator });
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

		const doc = await facultyManager.deleteOneById(id);
		res.send({ doc });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

module.exports = router;
