'use strict';

const { loggerCron } = require('../config/logger');
const { User, Task, Twitter } = require('../db/models');
const { Op } = require('sequelize');
const moment = require('moment');
const TwitterLib = require('twitter');
const { each } = require('lodash');
const { TWITTER_API_SECRET, TWITTER_API_KEY } = require('../constants');
const { sleep } = require('../api/helpers/general');
const { cryptr } = require('../utils/cryptr');

const run = () => {
	loggerCron.info('cron/task/taskCronJob started');
	Task.findAll({
		where: {
			deadline: {
				[Op.gte]: moment(),
				[Op.lte]: moment().add(1, 'hours')
			},
			completed: false,
			expired: false
		},
		include: {
			model: User
		}
	})
		.then((tasks) => {
			loggerCron.info('cron/task/taskCronJob tasks for cron job', tasks.length);
			each(tasks, async (task) => {
				loggerCron.info('cron/task/taskCronJob task id', task.id, 'userId', task.User.id);
				each((task.bomb), async (data, method) => {
					loggerCron.info('cron/task/taskCronJob bomb task id', task.id, 'method', method);

					if (method === 'twitter') {
						const twitterAuth = await Twitter.findOne({
							where: {
								userId: task.User.id
							},
							raw: true
						});

						const twitterClient = new TwitterLib({
							consumer_key: TWITTER_API_KEY,
							consumer_secret: TWITTER_API_SECRET,
							access_token_key: cryptr.decrypt(twitterAuth.accessToken),
							access_token_secret: cryptr.decrypt(twitterAuth.accessTokenSecret)
						});

						try {
							await twitterClient.post('statuses/update', { status: data.notification });
							loggerCron.info('cron/task/taskCronJob posted', task.id, 'method', method, 'posted');
						} catch (err) {
							loggerCron.error('cron/task/taskCronJob err', task.id, method, err.message);
						}
					}
					await sleep(1000);
				});
				await task.update({ expired: true }, { fields: [ 'expired' ] });
				loggerCron.info('cron/task/taskCronJob task id', task.id, 'finished');
			});
		})
		.then(() => {
			loggerCron.info('cron/task/taskCronJob finished');
		})
		.catch((err) => {
			loggerCron.error('cron/task/taskCronJob err', err.message);
		});
};

module.exports = {
	run
};