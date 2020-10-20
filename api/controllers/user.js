'use strict';

const { findUserByEmail, signupNewUser } = require('../helpers/user');
const { loggerUser } = require('../../config/logger');
const { issueToken } = require('../helpers/auth');

const signupUser = (req, res) => {
	const { email, password } = req.swagger.params.data.value;
	const ip = req.headers['x-real-ip'];

	loggerUser.info(req.uuid, 'controller/user/createUser user signup', email, 'ip', ip);

	signupNewUser(email, password)
		.then(() => {
			loggerUser.info(req.uuid, 'controller/user/createUser user created', email);
			return res.status(201).json({ message: 'Success' });
		})
		.catch((err) => {
			console.log(err);
			loggerUser.error(req.uuid, 'controller/user/createUser err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const loginUser = (req, res) => {
	const { email, password } = req.swagger.params.data.value;
	const ip = req.headers['x-real-ip'];

	loggerUser.info(req.uuid, 'controller/user/loginUser user login attempt', email, 'ip', ip);

	findUserByEmail(email)
		.then(async (user) => {
			if (!user) throw new Error('User does not exist');
			if (user.verificationCode === 0) throw new Error('User is not verified');
			if (!await user.validPassword(password, user.password)) throw new Error('Invalid password');
			loggerUser.info(req.uuid, 'controller/user/loginUser user login', user.email);
			return res.json({
				token: issueToken(user.id, user.email)
			});
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controller/user/loginUser err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	signupUser,
	loginUser
};
