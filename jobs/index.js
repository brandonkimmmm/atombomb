'use strict';

const { CronJob } = require('cron');
const postTaskBombCron = require('./postTaskBombCron');
const notifyTaskDeadlineCron = require('./notifyTaskDeadlineCron');

const job = new CronJob('* * * * *', () => {
	postTaskBombCron.run();
	notifyTaskDeadlineCron.run();
}, null, true, 'Asia/Seoul');

job.start();