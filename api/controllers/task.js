'use strict';

const { createTask, findTask } = require('../helpers/task');
const { loggerTask } = require('../../config/logger');

const getTask = (req, res) => {
	loggerTask.verbose(req.uuid, 'controllers/task/getTask auth', req.auth);

	const userId = req.auth.sub.id;
	const { id } = req.swagger.params.id.value;

	loggerTask.info(req.uuid, 'controllers/task/getTask id', id);

	findTask({
		where: {
			userId,
			id
		},
		raw: true
	})
		.then((task) => {
			if (!task) throw new Error('Task not found');
			return res.json(task);
		})
		.catch((err) => {
			loggerTask.info(req.uuid, 'controllers/task/getTask err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const postTask = (req, res) => {
	loggerTask.verbose(req.uuid, 'controllers/task/postTask auth', req.auth);

	const { title, description, deadline } = req.swagger.params.data.value;

	loggerTask.info(req.uuid, 'controllers/task/postTask body', title, deadline);

	findTask({
		where: {
			title,
			description,
			deadline,
			userId: req.auth.sub.id
		}
	})
		.then((task) => {
			if (task) throw new Error('Task already exists');
			return createTask({
				title,
				description,
				deadline,
				userId: req.auth.sub.id
			});
		})
		.then((task) => {
			loggerTask.info(req.uuid, 'controllers/task/postTask new task', task.title, task.userId);
			return res.status(201).json(task);
		})
		.catch((err) => {
			loggerTask.error(req.uuid, 'controllers/task/postTask err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	postTask,
	getTask
};
