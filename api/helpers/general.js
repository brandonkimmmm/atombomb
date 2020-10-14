'use strict';

const { resolve } = require('bluebird');

const sleep = (ms) => {
	return setTimeout(resolve, ms);
};

module.exports = {
	sleep
};
