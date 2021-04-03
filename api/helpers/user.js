'use strict';

const { User } = require('../../db/models');
const { isValidPassword } = require('./general');
const { isEmail } = require('validator');
const { reject } = require('bluebird');
const { sendEmail } = require('../../mail/index');
const { MAILTYPE } = require('../../mail/strings');

const findUserByEmail = (email, opts = {}) => {
	return User.findOne({
		where: { email },
		...opts
	});
};

const findUserById = (id, opts = {}) => {
	return User.findOne({
		where: { id },
		...opts
	});
};

const findUser = (opts = {}) => {
	return User.findOne(opts);
};

const signupNewUser = (email, password) => {
	if (!isEmail(email)) {
		return reject(new Error('Invalid email'));
	}

	if (!isValidPassword(password)) {
		return reject(new Error('Invalid password'));
	}

	return findUserByEmail(email)
		.then((user) => {
			if (user) {
				throw new Error('User already exists');
			}
			return User.create({
				email,
				password
			});
		});
};

module.exports = {
	findUser,
	findUserByEmail,
	findUserById,
	signupNewUser
};
