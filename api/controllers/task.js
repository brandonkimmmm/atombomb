'use strict';

const { createTask, findTask, findAllTasks } = require('../helpers/task');
const { addBomb, removeBomb } = require('../helpers/bomb');
const { loggerTask } = require('../../config/logger');
const moment = require('moment');
const { isEmail } = require('validator');
const { Twitter, Task } = require('../../db/models');
const { all } = require('bluebird');

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

	const { title, description, deadline, notification } = req.swagger.params.data.value;

	if (moment(deadline).isBefore(moment().add(1, 'hours'))) {
		loggerTask.error(req.uuid, 'controllers/task/postTask err', 'invalid deadline', deadline);
		return res.status(400).json({ message: 'Deadline must be at least one hour after time of creation' });
	}

	if (notification.length > 280) {
		loggerTask.error(req.uuid, 'controllers/task/postTask err', 'notification too long');
		return res.status(400).json({ message: 'Notification can be 280 characters at most' });
	}

	loggerTask.info(req.uuid, 'controllers/task/postTask body', title, deadline);

	all([
		Twitter.findOne({
			where: {
				userId: req.auth.sub.id
			},
			raw: true
		}),
		Task.count({
			where: {
				userId: req.auth.sub.id,
				completed: false,
				expired: false
			}
		})
	])
		.then(([ twitter, tasks ]) => {
			if (!twitter) {
				throw new Error('Please connect your Twitter account');
			}
			if (tasks > 2) {
				throw new Error('Can only have two active tasks at a time');
			}

			return createTask({
				title,
				description,
				deadline,
				userId: req.auth.sub.id,
				bomb: {
					twitter: {
						notification
					}
				}
			});
		})
		.then((task) => {
			loggerTask.info(req.uuid, 'controllers/task/postTask new task', task.title, task.id);
			return res.status(201).json(task);
		})
		.catch((err) => {
			loggerTask.error(req.uuid, 'controllers/task/postTask err', err.stack);
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
			if (task.completed) throw new Error('Task is already completed');
			if (task.expired) throw new Error('Task is expired');
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

	if (moment(deadline).isBefore(moment().add(1, 'hours'))) {
		loggerTask.error(req.uuid, 'controllers/task/updateTaskDeadline err', 'invalid deadline', deadline);
		return res.status(400).json({ message: 'Deadline must be at least one hour after time of update' });
	}

	loggerTask.info(req.uuid, 'controllers/task/updateTaskDeadline body', id, deadline);

	findTask({
		where: {
			userId,
			id
		}
	})
		.then((task) => {
			if (!task) throw new Error('Task not found');
			if (task.completed) throw new Error('Task is already completed');
			if (task.expired) throw new Error('Task is expired');
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

const postTaskBomb = (req, res) => {
	loggerTask.verbose(req.uuid, 'controllers/task/postTaskBomb auth', req.auth);

	const userId = req.auth.sub.id;
	const id = req.swagger.params.id.value;
	let { method, notification, opts } = req.swagger.params.data.value;
	method = method.toLowerCase();

	loggerTask.info(req.uuid, 'controllers/task/postTaskBomb id', id, 'method', method);

	return findTask({
		where: {
			id,
			userId
		}
	})
		.then((task) => {
			if (!task) throw new Error('Task not found');
			if (task.completed) throw new Error('Task is already completed');
			if (task.expired) throw new Error('Task is expired');
			return addBomb(userId, task, method, notification, opts);
		})
		.then((task) => {
			loggerTask.info(req.uuid, 'controllers/task/postTaskBomb id bomb added', id);
			return res.json(task);
		})
		.catch((err) => {
			loggerTask.error(req.uuid, 'controllers/task/postTaskBomb err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const deleteTaskBomb = (req, res) => {
	loggerTask.verbose(req.uuid, 'controllers/task/deleteTaskBomb auth', req.auth);

	const userId = req.auth.sub.id;
	const id = req.swagger.params.id.value;
	let method = req.swagger.params.method.value;
	method = method.toLowerCase();

	loggerTask.info(req.uuid, 'controllers/task/deleteTaskBomb id', id, 'method', method);

	return findTask({
		where: {
			id,
			userId
		}
	})
		.then((task) => {
			if (!task) throw new Error('Task not found');
			if (task.completed) throw new Error('Task is already completed');
			if (task.expired) throw new Error('Task is expired');
			return removeBomb(task, method);
		})
		.then((task) => {
			loggerTask.info(req.uuid, 'controllers/task/deleteTaskBomb id bomb method deleted', id, method);
			return res.json(task);
		})
		.catch((err) => {
			loggerTask.error(req.uuid, 'controllers/task/deleteTaskBomb err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const setTaskCompleted = (req, res) => {
	loggerTask.verbose(req.uuid, 'controllers/task/setTaskCompleted auth', req.auth);

	const userId = req.auth.sub.id;
	const id = req.swagger.params.id.value;

	loggerTask.info(req.uuid, 'controllers/task/setTaskCompleted id', id);

	return findTask({
		where: {
			id,
			userId
		}
	})
		.then((task) => {
			if (!task) throw new Error('Task not found');
			if (task.expired) throw new Error('Task is expired');
			if (task.completed) throw new Error('Task is already complete');
			return task.update({
				completed: true
			}, { returning: true, fields: ['completed'] });
		})
		.then((task) => {
			loggerTask.info(req.uuid, 'controllers/task/setTaskCompleted set as complete', id);
			return res.json(task);
		})
		.catch((err) => {
			loggerTask.error(req.uuid, 'controllers/task/setTaskCompleted err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	postTask,
	getTask,
	deleteTask,
	getAllTasks,
	updateTaskDeadline,
	postTaskBomb,
	deleteTaskBomb,
	setTaskCompleted
};
