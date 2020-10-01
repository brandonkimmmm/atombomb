'use strict';

const { User } = require('../../db/models');

const findUserByEmail = (email) => {
	return User.findOne({
		where: { email }
	});
};

const findUserById = (id) => {
	return User.findOne({
		where: { id }
	});
};

module.exports = {
	findUserByEmail,
	findUserById
};
