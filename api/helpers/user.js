'use strict';

const { User, VerificationCode } = require('../../db/models');
const { isValidPassword, sleep } = require('./general');
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
		})
		.then((user) => {
			return VerificationCode.findOne({ where: { userId: user.id }, raw: true });
		})
		.then((verificationCode) => {
			sendEmail(
				MAILTYPE.SIGNUP,
				email,
				verificationCode.code
			);
			return;
		});
};

module.exports = {
	findUserByEmail,
	findUserById,
	signupNewUser
};
