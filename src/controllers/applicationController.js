const router = require('express').Router();
const upload = require('multer')();
const generalHelper = require('../utils/generalHelper');
const errorHelper = require('../utils/errorHelper');
const { isAdmin, isLogged } = require('../middlewares/authMiddleWare');
const fs = require('fs');
const path = require('path');
const applicationManager = require('../managers/applicationManager');
const { globalRegex } = require('../config/regex');
const userManager = require('../managers/userManager');

/* GET */

router.get('/getImage/:imageName', isLogged, async (req, res) => {
	const imageName = req.params.imageName;
	const imagePath = path.resolve(__dirname, '..', 'assets', imageName);
	try {
		if (!fs.existsSync(imagePath)) throw new Error('Invalid image');

		res.sendFile(imagePath);
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

/* POST */

router.post('/getPage/:page', isAdmin, async (req, res) => {
	const page = req.params.page;
	try {
		if (!parseInt(page)) {
			throw new Error('Wrong page');
		}

		const skip = generalHelper.calcSkip(page);

		const docs = await applicationManager.getForPage(skip);
		const docCount = await applicationManager.getCount();
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

		const docs = await applicationManager.getPageByParam(select, search, skip);
		const docCount = await applicationManager.getCountByParam(select, search);
		res.send({ docs, docCount });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

router.post('/createOne', isLogged, upload.single('file'), async (req, res) => {
	const form = req.file;
	const jwt = req.isLoggedToken;
	const { academicYear } = req.body;

	try {
		if (form.originalname != 'application.pdf') throw new Error('Invalid file');

		const user = await userManager.getOneByParam({ _id: jwt._id });
		if (!user) throw new Error('Invalid user');

		const application = await applicationManager.createOne({
			form: form.buffer,
			userRef: user._id,
			status: 'pending',
			academicYear,
		});

		const fileBytes = new Uint8Array(form.buffer);
		fs.writeFileSync(form.originalname, fileBytes);
		res.send({ doc: application });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

router.patch('/updateOne/:id', isAdmin, async (req, res) => {
	const id = req.params.id;
	// make for all properties
	const { status } = req.body;
	try {
		if (!globalRegex.docId.exec(id)) throw new Error('Invalid id');

		const application = await applicationManager.updateOneById(id, {
			status,
		});

		res.send({ doc: application });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

module.exports = router;
