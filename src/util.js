const mongoose = require('mongoose');
const winston = require('winston');

mongoose.Promise = global.Promise;

//a simple utility for connecting to the DB 
const connectDb = function(url) {
	
	return mongoose.connect(url)
	.then(function ()  {
		console.log('connected to DB: ', url);
		
		let db = mongoose.connection();
		db.on('error', console.error.bind(console, 'connection error:'));
		db.on('open', console.info.bind(console, `db connection successful at url: ${url}`));

	}).catch( function (err) {
		if (err) {
			console.error.bind(console, 'connection error:');
		}
	});
}

//prouction logger will log errors as well as all info 
const logger  = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 'user-microservice' },
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

module.exports = { connectDb, logger };