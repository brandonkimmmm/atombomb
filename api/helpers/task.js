'use strict';

const { Task } = require('../../db/models');

const findTask = (query) => {
	return Task.findOne(query);
};

const createTask = (data) => {
	return Task.create(data);
};

module.exports = {
	findTask,
	createTask
};