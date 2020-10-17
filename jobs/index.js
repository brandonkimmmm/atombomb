'use strict';

const { CronJob } = require('cron');
const postTaskBombCron = require('./postTaskBombCron');

const job = new CronJob('* * * * *', () => {
	postTaskBombCron.run();
}, null, false, 'Asia/Seoul');

job.start();