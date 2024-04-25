const router = require('express').Router();
const userDataController = require('../controllers/userDataController');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const fieldOfEducationController = require('../controllers/FieldsOfEducationController');
const facultyController = require('../controllers/FacultyController');
const foreignContactController = require('../controllers/foreignContactController');
const receivingContactController = require('../controllers/receivingContactController');
const mobilityController = require('../controllers/mobilityController');
const applicationController = require('../controllers/applicationController');

router.use('/admins', adminController);
router.use('/usersData', userDataController);
router.use('/users', userController);
router.use('/fields', fieldOfEducationController);
router.use('/faculties', facultyController);
router.use('/foreignContacts', foreignContactController);
router.use('/receivingContacts', receivingContactController);
router.use('/mobilities', mobilityController);
router.use('/applications', applicationController);

router.get('*', (req, res) => {
	res.status(404).send('Not Found');
});

module.exports = router;
