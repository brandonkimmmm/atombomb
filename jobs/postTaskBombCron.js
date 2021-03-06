'use strict';

const { loggerCron } = require('../config/logger');
const { User, Task, Twitter } = require('../db/models');
const { Op } = require('sequelize');
const moment = require('moment');
const TwitterLib = require('twitter');
const { each } = require('lodash');
const { TWITTER_API_SECRET, TWITTER_API_KEY, TASK_STATUS } = require('../constants');
const { sleep } = require('../api/helpers/general');
const { cryptr } = require('../utils/cryptr');
const { sendEmail } = require('../mail');
const { MAILTYPE } = require('../mail/strings');

const run = () => {
	loggerCron.info('cron/task/postTaskBombCron started');
	Task.findAll({
		where: {
			deadline: {
				[Op.gte]: moment().seconds(0).milliseconds(0),
				[Op.lte]: moment().seconds(0).milliseconds(0).add(1, 'minutes')
			},
			status: TASK_STATUS.ACTIVE
		},
		include: {
			model: User,
			attributes: ['email', 'id'],
			include: {
				model: Twitter,
				attributes: ['accessToken', 'accessTokenSecret']
			}
		}
	})
		.then((tasks) => {
			loggerCron.info('cron/task/postTaskBombCron tasks for cron job', tasks.length);
			each(tasks, async (task) => {
				loggerCron.info('cron/task/postTaskBombCron task id', task.id, 'userId', task.User.id);
				each((task.bomb), async (data, method) => {
					loggerCron.info('cron/task/postTaskBombCron bomb task id', task.id, 'method', method);
					const twitterClient = new TwitterLib({
						consumer_key: TWITTER_API_KEY,
						consumer_secret: TWITTER_API_SECRET,
						access_token_key: cryptr.decrypt(task.User.Twitter.accessToken),
						access_token_secret: cryptr.decrypt(task.User.Twitter.accessTokenSecret)
					});

					try {
						await twitterClient.post('statuses/update', { status: data.notification });
						loggerCron.info('cron/task/postTaskBombCron posted', task.id, 'method', method, 'posted');
					} catch (err) {
						loggerCron.error('cron/task/postTaskBombCron err', task.id, method, err.message);
					}

					await sleep(1000);
				});
				await task.update({ status: TASK_STATUS.FAILED }, { fields: [ 'status' ] });
				loggerCron.info('cron/task/postTaskBombCron task id', task.id, 'finished');
			});
		})
		.then(() => {
			loggerCron.info('cron/task/postTaskBombCron finished');
		})
		.catch((err) => {
			loggerCron.error('cron/task/postTaskBombCron err', err.stack);
		});
};

module.exports = {
	run
};