const router = require('express').Router();
const generalHelper = require('../utils/generalHelper');
const userDataManager = require('../managers/userDataManager');
const userManager = require('../managers/userManager');
const fieldOfEducationManager = require('../managers/FieldOfEducationManager');
const mobilityManager = require('../managers/mobilityManager');
const receivingContactManager = require('../managers/receivingContactManager');
const foreignContactManager = require('../managers/ForeignContactManager');
const facultyManager = require('../managers/FacultyManager');
const errorHelper = require('../utils/errorHelper');
const { isAdmin } = require('../middlewares/authMiddleWare');
const { globalRegex } = require('../config/regex');

/* POST */

router.post('/getAll', isAdmin, async (req, res) => {
	try {
		const usersData = await userDataManager.getAll();
		res.send({ students: usersData });
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

		const docs = await userDataManager.getForPage(skip);
		const docCount = await userDataManager.getCount();
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

		const docs = await userDataManager.getPageByParam(select, search, skip);
		const docCount = await userDataManager.getCountByParam(select, search);
		res.send({ docs, docCount });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

router.post('/createOne', isAdmin, async (req, res) => {
	let {
		firstName,
		lastName,
		birthDate,
		sex,
		birthPlace,
		nationality,
		address,
		phone,
		academicYearFrom,
		academicYearTo,
		mobilityType,
		semesterSeason,
		fieldOfStudyRef,
		mobilityRef,
		sendingContactRef,
		sendingFaculty,
		receivingFacultyRef,
		receivingContactRef,
		studyFrom,
		studyTo,
		accommodation,
		stayFrom,
		stayTo,
		bulgarianCourse,
		visitReason,
		motherLanguage,
		homeLanguage,
		studyDegree,
		studyYears,
		priorStudyErasmus,
		priorStudyMonths,
	} = req.body;
	const jwt = req.isLoggedToken;

	try {
		const user = await userManager.getOneByParam({ _id: jwt._id });
		if (!user) throw new Error('Invalid user');
		const userRef = user._id;

		const badUserData = await userDataManager.findExistingOrNotEqualToId({ userRef });
		if (badUserData[0]) throw new Error('User data for this user already exists');

		const field = await fieldOfEducationManager.findExisting(fieldOfStudyRef);
		if (!field[0]) throw new Error('Invalid field of study');
		fieldOfStudyRef = field._id;

		const mobility = await mobilityManager.findExistingOrNotEdualToId({ code: mobilityRef });
		if (!mobility[0]) throw new Error('Invalid mobility');
		mobilityRef = mobility._id;

		const sendingContact = await foreignContactManager.findExisting(sendingContactRef);
		if (!sendingContact[0]) throw new Error('Invalid sending contact');
		sendingContactRef = sendingContact._id;

		const receivingContact = await receivingContactManager.findExisting(receivingContactRef);
		if (!receivingContact[0]) throw new Error('Invalid receiving contact');
		receivingContactRef = receivingContact._id;

		const receivingFaculty = await facultyManager.findExisting(receivingFacultyRef);
		if (!receivingFaculty[0]) throw new Error('Invalid receiving faculty');
		receivingFacultyRef = receivingFaculty._id;

		const userData = await userDataManager.create({
			userRef,
			firstName,
			lastName,
			birthDate,
			sex,
			birthPlace,
			nationality,
			address,
			phone,
			academicYearFrom,
			academicYearTo,
			mobilityType,
			semesterSeason,
			fieldOfStudyRef,
			mobilityRef,
			sendingContactRef,
			sendingFaculty,
			receivingFacultyRef,
			receivingContactRef,
			studyFrom,
			studyTo,
			accommodation,
			stayFrom,
			stayTo,
			bulgarianCourse,
			visitReason,
			motherLanguage,
			homeLanguage,
			studyDegree,
			studyYears,
			priorStudyErasmus,
			priorStudyMonths,
		});

		res.send({ userData });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

/* PATCH */

router.patch('/updateOne/:id', isAdmin, async (req, res) => {
	const id = req.params.id;
	let {
		userRef,
		firstName,
		lastName,
		birthDate,
		sex,
		birthPlace,
		nationality,
		address,
		phone,
		academicYearFrom,
		academicYearTo,
		mobilityType,
		semesterSeason,
		fieldOfStudyRef,
		mobilityRef,
		sendingContactRef,
		sendingFaculty,
		receivingFacultyRef,
		receivingContactRef,
		studyFrom,
		studyTo,
		accommodation,
		stayFrom,
		stayTo,
		bulgarianCourse,
		visitReason,
		motherLanguage,
		homeLanguage,
		studyDegree,
		studyYears,
		priorStudyErasmus,
		priorStudyMonths,
	} = req.body;

	try {
		if (!globalRegex.docId.exec(id)) throw new Error('invalid id');

		const user = await userManager.getOneByParam({ email: userRef });
		if (!user) throw new Error('Invalid user');
		userRef = user._id;

		const badUserData = await userDataManager.findExistingOrNotEqualToId({ userRef }, id);
		if (badUserData[0]) throw new Error('Invalid user');

		const mobility = await mobilityManager.findExistingOrNotEdualToId({ code: mobilityRef });
		if (!mobility[0]) throw new Error('Invalid mobility');
		mobilityRef = mobility._id;

		const field = await fieldOfEducationManager.findExisting(fieldOfStudyRef);
		if (!field[0]) throw new Error('Invalid field of study');
		fieldOfStudyRef = field._id;

		const sendingContact = await foreignContactManager.findExisting(sendingContactRef);
		if (!sendingContact[0]) throw new Error('Invalid sending contact');
		sendingContactRef = sendingContact._id;

		const receivingContact = await receivingContactManager.findExisting(receivingContactRef);
		if (!receivingContact[0]) throw new Error('Invalid receiving contact');
		receivingContactRef = receivingContact._id;

		const receivingFaculty = await facultyManager.findExisting(receivingFacultyRef);
		if (!receivingFaculty[0]) throw new Error('Invalid receiving faculty');
		receivingFacultyRef = receivingFaculty._id;

		const userData = await userDataManager.updateOneById(id, {
			userRef,
			firstName,
			lastName,
			birthDate,
			sex,
			birthPlace,
			nationality,
			address,
			phone,
			academicYearFrom,
			academicYearTo,
			mobilityType,
			semesterSeason,
			fieldOfStudyRef,
			mobilityRef,
			sendingContactRef,
			sendingFaculty,
			receivingFacultyRef,
			receivingContactRef,
			studyFrom,
			studyTo,
			accommodation,
			stayFrom,
			stayTo,
			bulgarianCourse,
			visitReason,
			motherLanguage,
			homeLanguage,
			studyDegree,
			studyYears,
			priorStudyErasmus,
			priorStudyMonths,
		});

		res.send({ userData });
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

		const userData = await userDataManager.deleteOneById(id);
		res.send({ userData });
	} catch (err) {
		const message = errorHelper.getOne(err);
		res.status(400).send({ message });
	}
});

module.exports = router;
