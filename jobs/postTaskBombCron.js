'use strict';

const { loggerCron } = require('../config/logger');
const { User, Task, Twitter, Op } = require('../db/models');
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
			model: User,
			as: 'user'
		}
	})
		.then((tasks) => {
			loggerCron.info('cron/task/taskCronJob tasks number', tasks.length);
			each(tasks, async (task) => {
				loggerCron.info('cron/task/taskCronJob task id', task.id, 'userId', task.user.id);
				each((task.bomb), async (notification, socialMedia) => {
					loggerCron.info('cron/task/taskCronJob bomb task id', task.id, 'socialMedia', socialMedia);

					if (socialMedia === 'twitter') {
						const twitterAuth = await Twitter.findOne({
							where: {
								userId: task.user.id
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
							await twitterClient.post('statuses/update', { status: notification });
							loggerCron.info('cron/task/taskCronJob posted', task.id, 'socialMedia', socialMedia, 'posted');
						} catch (err) {
							loggerCron.error('cron/task/taskCronJob err', task.id, socialMedia, err.message);
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