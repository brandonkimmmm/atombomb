'use strict';

const { loggerCron } = require('../config/logger');
const { User, Task, Twitter, Op } = require('../db/models');
const moment = require('moment');
const { CronJob } = require('cron');
const TwitterLib = require('twitter');
const { each } = require('lodash');
const { TWITTER_API_SECRET, TWITTER_API_KEY } = require('../constants');
const { sleep } = require('../api/helpers/general');

const taskCronJob = () => {
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
			each(tasks, async (task) => {
				each((task.bomb), async (notification, socialMedia) => {
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
							access_token_key: twitterAuth.accessToken,
							access_token_secret: twitterAuth.accessTokenSecret
						});

						await twitterClient.post('statuses/update', { status: notification });
						await sleep(1000);
					}
				});
				await task.update({ expired: true }, { fields: [ 'expired' ] });
			});
		})
		.then(() => {
			loggerCron.info('cron/task/taskCronJob finished');
		})
		.catch((err) => {
			loggerCron.error('cron/task/taskCronJob err', err.message);
		});
};

const job = new CronJob('0 * * * *', taskCronJob, null, false, 'Asia/Seoul');
job.start();