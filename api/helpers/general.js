'use strict';

const { resolve } = require('bluebird');

const sleep = (ms) => {
	return setTimeout(resolve, ms);
};

const convertSequelizeCountAndRows = (data) => {
	return {
		count: data.count,
		data: data.rows.map((row) => {
			const item = Object.assign({}, row.dataValues);
			// delete item.id;
			return item;
		})
	};
};

module.exports = {
	convertSequelizeCountAndRows,
	sleep
};
