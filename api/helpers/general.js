'use strict';

const { resolve } = require('bluebird');

const sleep = (ms) => {
	return setTimeout(resolve, ms);
};

const convertSequelizeCountAndRows = (data) => {
	return {
		count: data.count,
		data: data.rows
	};
};

const isValidPassword = (password) => {
	return /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(password);
};

const getPagination = (limit = 50, page = 1) => {
	if (limit > 50) {
		limit = 50;
	} else if (limit <= 0) {
		limit = 1;
	}

	if (page < 1) {
		page = 1;
	}

	return {
		limit,
		offset: limit * (page - 1)
	};
};

const getOrdering = (orderBy, order, defaultOrder = ['id', 'desc']) => {
	let ordering = {
		order: [defaultOrder]
	};

	if (orderBy) {
		ordering.order = [[orderBy, order || 'desc']];
	}

	return ordering;
};

module.exports = {
	convertSequelizeCountAndRows,
	sleep,
	isValidPassword,
	getPagination,
	getOrdering
};
