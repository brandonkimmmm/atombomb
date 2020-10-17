'use strict';

const jwt = require('jsonwebtoken');
const { SECRET } = require('../../constants');
const { loggerAuth } = require('../../config/logger');

const issueToken = (id, email) => {
	const token = jwt.sign(
		{
			sub: {
				id,
				email
			},
			iss: 'atombomb'
		},
		SECRET,
		{
			expiresIn: '1d'
		}
	);
	return token;
};

const validateToken = (req, securityDescription, token, cb) => {
	const sendError = (msg) => {
		loggerAuth.error(req.uuid, 'helpers/token/validateToken err', msg);
		return req.res.status(401).json({ message: `Access Denied: ${msg}` });
	};

	if (token && token.indexOf('Bearer ') == 0) {
		const tokenString = token.split(' ')[1];
		jwt.verify(tokenString, SECRET, (error, token) => {
			if (!error && token) {
				loggerAuth.verbose(
					req.uuid,
					'helpers/auth/verifyToken verified_token',
					token.sub
				);
				req.auth = token;
				cb(null);
			} else {
				sendError('Invalid Token');
			}
		});
	} else {
		sendError('Missing Header');
	}
};

module.exports = {
	issueToken,
	validateToken
};
