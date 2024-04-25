const app = require('express')();

const routes = require('./config/routes');
const setupExpress = require('./config/express');
const { connectDb, listenForErrors } = require('./config/database');

const port = 5000;

connectDb()
	.then(() => {
		console.log('Db connected');

		listenForErrors();

		setupExpress(app);
		app.use(routes);

		app.listen(port, () => console.log(`Server is listening on port ${port}...`));
	})
	.catch(err => console.log(err));
