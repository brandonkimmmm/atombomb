'use strict';

const { formatDate, getCountryFromIp, sendSMTPEmail } = require('./utils');
const payloadTemplate = require('./templates/helpers/payloadTemplate');
const { loggerEmail } = require('../config/logger');
const { MAILTYPE } = require('./strings');
const generateMessageContent = require('./templates');
const { DOMAIN, SENDER_EMAIL, SUPPORT_EMAIL } = require('../constants');
const SUPPORT_SOURCE = `Atom Bomb Support <${SENDER_EMAIL}>'`;

const sendEmail = (
	type,
	receiver,
	data,
	domain = DOMAIN
) => {
	let from = SUPPORT_SOURCE;
	let to = {
		ToAddresses: [receiver]
	};
	switch (type) {
		case MAILTYPE.WELCOME: {
			break;
		}
		case MAILTYPE.LOGIN: {
			if (data.time) data.time = formatDate(data.time);
			if (data.ip) data.country = getCountryFromIp(data.ip);
			break;
		}
		case MAILTYPE.SIGNUP: {
			to.BccAddresses = [SUPPORT_EMAIL];
			break;
		}
		case MAILTYPE.CONTACT_FORM: {
			to.ToAddresses = [SUPPORT_EMAIL];
			break;
		}
		default:
			return;
	}
	const messageContent = generateMessageContent(
		type,
		receiver,
		data,
		domain
	);
	const payload = payloadTemplate(from, to, messageContent);
	return send(payload);
};

const send = (params) => {
	return sendSMTPEmail(params)
		.then((info) => {
			return info;
		})
		.catch((error) => {
			loggerEmail.error('mail/index/sendSTMPEmail', error);
		});
};

module.exports = {
	sendEmail
};
