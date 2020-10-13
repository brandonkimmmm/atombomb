'use strict';

const { promisifyAll } = require('bluebird');
const redis = require('redis');
// const config = require('../config/redis');
const { loggerRedis } = require('../config/logger');
const { REDIS_HOST, REDIS_PORT } = require('../constants');

promisifyAll(redis.RedisClient.prototype);
promisifyAll(redis.Multi.prototype);

const client = redis.createClient({
	host: REDIS_HOST,
	port: REDIS_PORT
});

client.on('ready', () => {
	if (loggerRedis) loggerRedis.info('Redis is ready');
});

client.on('connect', () => {
	if (loggerRedis) loggerRedis.verbose('Connect to redis');
	// if (config.client.password) {
	// 	client.auth(config.client.password, () => {
	// 		if (loggerRedis) loggerRedis.verbose('Authenticated to redis');
	// 	});
	// }
});

client.on('error', (err) => {
	if (loggerRedis) loggerRedis.error('REDIS', err.message);
	if (loggerRedis) loggerRedis.error(err);
	process.exit(0);
});


module.exports = client;
