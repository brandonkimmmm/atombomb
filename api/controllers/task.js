'use strict';

const { createTask, findTask, findAllTasks } = require('../helpers/task');
const { loggerTask } = require('../../config/logger');
const moment = require('moment');

const getTask = (req, res) => {
	loggerTask.verbose(req.uuid, 'controllers/task/getTask auth', req.auth);

	const userId = req.auth.sub.id;
	const id = req.swagger.params.id.value;

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

const deleteTask = (req, res) => {
	loggerTask.verbose(req.uuid, 'controllers/task/deleteTask auth', req.auth);

	const userId = req.auth.sub.id;
	const id = req.swagger.params.id.value;

	loggerTask.info(req.uuid, 'controllers/task/deleteTask id', id);

	findTask({
		where: {
			userId,
			id
		}
	})
		.then((task) => {
			if (!task) throw new Error('Task not found');
			return task.destroy();
		})
		.then(() => {
			loggerTask.info(req.uuid, 'controllers/task/deleteTask deleted task', id);
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerTask.error(req.uuid, 'controllers/task/deleteTask err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const updateTaskDeadline = (req, res) => {
	loggerTask.verbose(req.uuid, 'controllers/task/updateTaskDeadline auth', req.auth);

	const userId = req.auth.sub.id;
	let { id, deadline } = req.swagger.params.data.value;

	loggerTask.info(req.uuid, 'controllers/task/updateTaskDeadline body', id, deadline);

	findTask({
		where: {
			userId,
			id
		}
	})
		.then((task) => {
			if (!task) throw new Error('Task not found');
			let deadlineChanges = task.deadlineChanges;
			if (deadlineChanges === 3) throw new Error('Cannot change deadline more than three times');
			deadlineChanges++;

			return task.update(
				{
					deadline,
					deadlineChanges
				},
				{
					fields: ['deadline', 'deadlineChanges'],
					returning: true
				}
			);
		})
		.then((task) => {
			loggerTask.info(req.uuid, 'controllers/task/updateTaskDeadline task deadline updated', id);
			return res.json(task);
		})
		.catch((err) => {
			loggerTask.error(req.uuid, 'controllers/task/updateTaskDeadline err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const getAllTasks = (req, res) => {
	loggerTask.verbose(req.uuid, 'controllers/task/getAllTasks auth', req.auth);

	const { id } = req.auth.sub;

	return findAllTasks({
		where: {
			userId: id
		}
	})
		.then((tasks) => {
			loggerTask.info(req.uuid, 'controllers/task/getAllTasks count', tasks.count);
			return res.json(tasks);
		})
		.catch((err) => {
			loggerTask.error(req.uuid, 'controllers/task/getAllTasks err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	postTask,
	getTask,
	deleteTask,
	getAllTasks,
	updateTaskDeadline
};
