function getOne(err) {
	let error;
	if (!err.errors) {
		error = err.message;
	} else {
		return Object.entries(err.errors)[0][1].message; // message of first error in the array
	}

	return error.includes('Cast to string failed') ? 'Nice try' : error;
}

module.exports = { getOne };
