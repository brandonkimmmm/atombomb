'use strict';

const { Task } = require('../../db/models');
const { loggerTask } = require('../../config/logger');

const createTask = (req, res) => {
	loggerTask.verbose('controllers/task/createTask auth', req.auth);

	const { title, description, deadline } = req.swagger.params.data.value;

	loggerTask.info('controllers/task/createTask body', title, deadline);

	Task.findOne({
		where: {
			title,
			description,
			deadline,
			userId: req.auth.sub.id
		}
	})
		.then((task) => {
			if (task) throw new Error('Task already exists');
			return Task.create({
				title,
				description,
				deadline,
				userId: req.auth.sub.id
			});
		})
		.then((task) => {
			loggerTask.info('controllers/task/createTask new task', task.title, task.userId);
			return res.status(201).json(task);
		})
		.catch((err) => {
			loggerTask.error('controllers/task/createTask err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	createTask
};
