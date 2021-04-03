'use strict';

const { findUserByEmail, signupNewUser } = require('../helpers/user');
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

const getUser = (req, res) => {
	loggerUser.verbose(req.uuid, 'controller/user/getUser auth', req.auth);

	const { email } = req.auth.sub;

	findUserByEmail(
		email,
		{
			raw: true,
			attributes: {
				exclude: ['password', 'verified', 'updatedAt']
			}
		}
	)
		.then((user) => {
			return res.json(user);
		})
		.catch((err) => {
			loggerUser.error(req.uuid, 'controller/user/getUser err', err.message);
			return res.json({ message: err.message });
		});
};

module.exports = {
	signupUser,
	loginUser,
	getUser
};
