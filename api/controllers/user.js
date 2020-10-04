'use strict';

const jwt = require('jsonwebtoken');
const { findUserByEmail } = require('../helpers/user');
const { User } = require('../../db/models');
const { loggerUser } = require('../../config/logger');
const { issueToken } = require('../helpers/auth');

const createUser = (req, res) => {
	const { email, password } = req.swagger.params.data.value;

	loggerUser.info('controller/user/createUser user signup', email);

	findUserByEmail(email)
		.then((user) => {
			if (user) throw new Error('User already exists');
			return User.create({ email, password });
		})
		.then((user) => {
			loggerUser.info('controller/user/createUser user created', user.email);
			return res.status(201).json({ email: user.email });
		})
		.catch((err) => {
			loggerUser.error('controller/user/createUser err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const loginUser = (req, res) => {
	const { email, password } = req.swagger.params.data.value;

	loggerUser.info('controller/user/loginUser user login attempt', email);

	findUserByEmail(email)
		.then(async (user) => {
			if (!user) throw new Error('User does not exist');
			if (!await user.validPassword(password, user.password)) throw new Error('Invalid password');
			loggerUser.info('controller/user/loginUser user login', user.email);
			return res.json({
				token: issueToken(user.id, user.email)
			});
		})
		.catch((err) => {
			loggerUser.error('controller/user/loginUser err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	createUser,
	loginUser
};
