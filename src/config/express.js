const express = require('express');
const { auth } = require('../middlewares/authMiddleWare');
const { sanitizeBody } = require('../middlewares/sanitiziationMiddleWare');
const cors = require('cors');

function setupExpress(app) {
	app.use(cors({ origin: 'http://localhost:4200' }));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(auth);
	app.use(sanitizeBody);
}

module.exports = setupExpress;
