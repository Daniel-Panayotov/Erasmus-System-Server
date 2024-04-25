const mongoose = require('mongoose');

const dbUrl = 'mongodb://127.0.0.1:27017/erasmus-system';

function connectDb() {
	return mongoose.connect(dbUrl);
}

function listenForErrors() {
	mongoose.connection.on('error', err => {
		console.log(err);
	});
}

module.exports = { connectDb, listenForErrors };
