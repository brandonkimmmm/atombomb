'use strict';

const { Task } = require('../../db/models');
const { convertSequelizeCountAndRows } = require('../helpers/general');

const findTask = (query) => {
	return Task.findOne(query);
};

const createTask = (data) => {
	return Task.create(data);
};

const findAllTasks = (query) => {
	return Task.findAndCountAll(query).then(convertSequelizeCountAndRows);
};

module.exports = {
	findTask,
	createTask,
	findAllTasks
};