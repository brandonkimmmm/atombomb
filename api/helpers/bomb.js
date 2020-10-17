'use strict';

const { CONNECTED_SOCIAL_MEDIA } = require('../../constants');

const addBomb = (task, method, post) => {
	if (!CONNECTED_SOCIAL_MEDIA.includes(method)) throw new Error(`Method ${method} not valid`);
	const updatedBomb = {
		...task.bomb,
		[method]: post
	};
	return task.update({
		bomb: updatedBomb
	}, { returning: true, fields: ['bomb'] });
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