'use strict';

const { User } = require('../../db/models');
const { isValidPassword } = require('./general');
const { isEmail } = require('validator');
const { reject } = require('bluebird');
const { sendEmail } = require('../../mail/index');
const { MAILTYPE } = require('../../mail/strings');

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
	findUserByEmail,
	findUserById,
	signupNewUser
};
