require('appmetrics-dash').attach();
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');

const utils = require('./util');
const connectDb = utils.connectDb;
const logger = utils.logger;

const router = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/', router);

app.use(function(err, req, res, next) {
	if (err) {
		logger.error(`Error in the code: ${err}`);
	}
	//set a status code on the error if we don't have one
  if (!err.statusCode) err.statusCode = 500; 
  res.status(err.statusCode).send(err.message); 
});

connectDb().then(async () => {
  app.listen(port, () =>
    logger.info(`App listening on port ${port}!`)
  );
});

module.exports = app;