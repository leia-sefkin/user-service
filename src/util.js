const mongoose = require('mongoose');
const winston = require('winston');

mongoose.Promise = global.Promise;

//prouction logger will log errors as well as all info 
const logger  = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 'user-service' },
	transports: [
		new winston.transports.File({ filename: 'error.log', level: 'error'}),
		new winston.transports.File({ filename: 'comibined.log' })
	]
});

//if not in production log to console
if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
		format: winston.format.simple()
	}));
}

//a simple utility for connecting to the DB 
const connectDb = function(url) {
	
	return mongoose.connect(url, {useMongoClient: true})
	.then(function ()  {
		logger.info(`DB connection successful at url: ${url}`);
		
		mongoose.connection.on('error', function(err) {
			logger.error(`DB connection error. Message: ${err.message}`)
		});

	}).catch( function (err) {
		if (err) {
			logger.error(`DB connection error. Message: ${err.message}`);
		}
	});
}

module.exports = { connectDb, logger };