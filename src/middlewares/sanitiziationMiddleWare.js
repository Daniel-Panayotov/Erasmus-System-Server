const { sanitizeFilter } = require('mongoose');

function sanitizeBody(req, res, next) {
	const sanitizedInput = {};

	for (let key in req.body) {
		const input = req.body[key];

		const filter = {
			[key]: input,
		};

		sanitizeFilter(filter);

		sanitizedInput[key] = filter[key];
	}

	req.body = sanitizedInput;
	next();
}

module.exports = { sanitizeBody };
