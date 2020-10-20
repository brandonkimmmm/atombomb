'use strict';

const { findUserByEmail, signupNewUser, verifyUserCode } = require('../helpers/user');
const { loggerUser } = require('../../config/logger');
const { issueToken } = require('../helpers/auth');
const { sendEmail } = require('../../mail');
const { MAILTYPE } = require('../../mail/strings');
const moment = require('moment');

const signupUser = (req, res) => {
	const { email, password } = req.swagger.params.data.value;
	const ip = req.headers['x-real-ip'];

	loggerUser.verbose(req.uuid, 'controller/user/signupUser user signup', email, 'ip', ip);

	signupNewUser(email, password)
		.then(() => {
			loggerUser.info(req.uuid, 'controller/user/signupUser user created', email);
			return res.status(201).json({ message: 'Success' });
		})
		.catch((err) => {
			console.log(err);
			loggerUser.error(req.uuid, 'controller/user/signupUser err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const loginUser = (req, res) => {
	const { email, password } = req.swagger.params.data.value;
	const ip = req.headers['x-real-ip'];
	const device = req.headers['user-agent'];
	const domain = req.headers['x-real-origin'];
	const time = moment().toISOString();

	loggerUser.verbose(req.uuid, 'controller/user/loginUser user login attempt', email, 'ip', ip);

	findUserByEmail(email)
		.then(async (user) => {
			if (!user) throw new Error('User does not exist');
			if (user.verificationCode === 0) throw new Error('User is not verified');
			if (!await user.validPassword(password, user.password)) throw new Error('Invalid password');

			loggerUser.info(req.uuid, 'controller/user/loginUser user login', user.email);

			sendEmail(
				MAILTYPE.LOGIN,
				email,
				{
					ip,
					time,
					device
				},
				domain
			);

			return res.json({
				token: issueToken(user.id, user.email)
			});
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controller/user/loginUser err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const verifyUser = (req, res) => {
	const { email, verification_code } = req.swagger.params.data.value;
	const ip = req.headers['x-real-ip'];

	loggerUser.verbose(req.uuid, 'controller/user/verifyUser user email', email, 'ip', ip);

	verifyUserCode(email, verification_code)
		.then(() => {
			return res.json({ message: 'Success' });
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controller/user/verifyUser err', err.message);
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	signupUser,
	loginUser,
	verifyUser
};
