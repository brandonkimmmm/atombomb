'use strict';

const { loggerCron } = require('../config/logger');
const { User, Task } = require('../db/models');
const { Op } = require('sequelize');
const moment = require('moment');
const { each } = require('lodash');
const { sendEmail } = require('../mail');
const { MAILTYPE } = require('../mail/strings');

const run = () => {
	loggerCron.info('cron/task/notifyTaskDeadlineCron started');
	Task.findAll({
		where: {
			deadline: {
				[Op.gte]: moment().seconds(0).milliseconds(0).add(24, 'hours'),
				[Op.lte]: moment().seconds(0).milliseconds(0).add(25, 'hours')
			},
			completed: false,
			expired: false
		},
		raw: true,
		nested: true,
		include: {
			model: User,
			attributes: ['email', 'id']
		}
	})
		.then((tasks) => {
			loggerCron.info('cron/task/notifyTaskDeadlineCron tasks for cron job', tasks.length);
			each(tasks, (task) => {
				loggerCron.info('cron/task/notifyTaskDeadlineCron task id', task.id, 'userId', task.User.id);
				sendEmail(
					MAILTYPE.NOTIFY_DEADLINE,
					task.User.email,
					{
						task: task.title,
						deadline: task.deadline
					}
				);
				loggerCron.info('cron/task/notifyTaskDeadlineCron task id', task.id, 'finished');
			});
		})
		.then(() => {
			loggerCron.info('cron/task/notifyTaskDeadlineCron finished');
		})
		.catch((err) => {
			loggerCron.error('cron/task/notifyTaskDeadlineCron err', err.stack);
		});
};

module.exports = {
	run
};