'use strict';

const winston = require('winston');
const { format, transports } = winston;
const { combine, timestamp, colorize, printf, align, json } = format;
const { SPLAT } = require('triple-beam');
const uuid = require('uuid').v4;
const { isObject } = require('lodash');

const emitters = require('events');
emitters.EventEmitter.defaultMaxListeners = 50;

const isMainnet = process.env.NODE_ENV === 'production';
const LOG_LEVEL = process.env.LOG_LEVEL || 'verbose';

const formatObject = (param) => {
	if (isObject(param)) {
		return JSON.stringify(param);
	}
	return param;
};

const all = format((info) => {
	const splat = info[SPLAT] || [];
	const message = formatObject(info.message);
	const rest = splat.map(formatObject).join(' ');
	info.message = `${message} ${rest}`;
	return info;
});

const generateLoggerConfiguration = (name) => {
	const transportsConfig = [
		new transports.Console({ level: LOG_LEVEL })
	];

	const config = {
		format: combine(
			all(),
			timestamp(),
			colorize(),
			align(),
			printf(
				(info) =>
					`${info.timestamp} ${info.level}: ${formatObject(info.message)}`
			)
		),
		transports: transportsConfig
	};
	if (isMainnet) {
		config.format = combine(
			all(),
			timestamp(),
			json()
		);
	}

	return config;
};

const LOGGER_NAMES = {
	db: 'db',
	api: 'api',
	user: 'user',
	auth: 'auth',
	task: 'task',
	twitter: 'twitter',
	redis: 'redis',
	cron: 'cron',
	email: 'email'
};

winston.loggers.add('default', generateLoggerConfiguration('all', false));

Object.entries(LOGGER_NAMES).forEach(([key, value], index) => {
	winston.loggers.add(value, generateLoggerConfiguration(value));
});

const logger = winston.loggers.get('default');
/*
	function to use in express middleware to log the request when it hits the server, it will add a uuid to the request for tracking purpose
 */
const logEntryRequest = (req, res, next) => {
	req.uuid = uuid();
	logger.info(
		req.uuid,
		'middleware/hostname',
		req.hostname,
		req.headers['x-real-ip'],
		req.headers['x-real-origin'],
		req.method,
		req.path
	);
	next();
};

const stream = {
	write: (message, encoding) => {
		logger.info(message);
	}
};

module.exports = {
	logEntryRequest,
	stream,
	logger,
	loggerDb: winston.loggers.get(LOGGER_NAMES.db),
	loggerApi: winston.loggers.get(LOGGER_NAMES.api),
	loggerUser: winston.loggers.get(LOGGER_NAMES.user),
	loggerAuth: winston.loggers.get(LOGGER_NAMES.auth),
	loggerTask: winston.loggers.get(LOGGER_NAMES.task),
	loggerTwitter: winston.loggers.get(LOGGER_NAMES.twitter),
	loggerRedis: winston.loggers.get(LOGGER_NAMES.redis),
	loggerCron: winston.loggers.get(LOGGER_NAMES.cron),
	loggerEmail: winston.loggers.get(LOGGER_NAMES.email)
};
