const { sanitizeFilter } = require('mongoose');

function calcSkip(page) {
	return parseInt(page) * 10 - 10;
}

module.exports = {
	calcSkip,
};
