'use strict';

const { CONNECTED_SOCIAL_MEDIA } = require('../../constants');
const models = require('../../db/models');

const addBomb = (userId, task, method, notification) => {
	if (!CONNECTED_SOCIAL_MEDIA.includes(method)) throw new Error(`Method ${method} not valid`);

	if (method !== 'email') {
		return models[method].findOne({
			where: {
				userId
			}
		}, { raw: true })
			.then((data) => {
				if (!data) throw new Error(`User did not connect Atom Bomb to method ${method}`);
				if (method === 'twitter' && notification.message.length > 180) throw new Error('Twitter posts cannot be over 180 characters');
				const updatedBomb = {
					...task.bomb,
					[method]: {
						notification
					}
				};
				return task.update({
					bomb: updatedBomb
				}, { returning: true, fields: ['bomb'] });
			});
	} else {
		const updatedBomb = {
			...task.bomb,
			[method]: {
				notification
			}
		};
		return task.update({
			bomb: updatedBomb
		}, { returning: true, fields: ['bomb'] });
	}
};

const removeBomb = (task, method) => {
	if (!CONNECTED_SOCIAL_MEDIA.includes(method)) throw new Error(`Method ${method} not valid`);
	if (!Object.keys(task.bomb).includes(method)) throw new Error(`Bomb with method ${method} does not exist`);
	delete task.bomb[method];
	return task.update({
		bomb: task.bomb
	}, { returning: true, fields: ['bomb'] });
};

module.exports = {
	addBomb,
	removeBomb
};