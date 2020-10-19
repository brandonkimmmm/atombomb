'use strict';

const moment = require('moment');
const geoip = require('geoip-lite');
const { DEFAULT_TIMEZONE, SMTP_SERVER, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = require('../constants');
const nodemailer = require('nodemailer');
const FORMATDATE = 'YYYY/MM/DD HH:mm:ss A Z';

const formatDate = (
	date,
	timezone = DEFAULT_TIMEZONE
) => {
	const momentDate = moment(date);
	let formatedDate;
	if (timezone) {
		formatedDate = momentDate.tz(timezone).format(FORMATDATE);
	} else {
		formatedDate = momentDate.format(FORMATDATE);
	}
	return formatedDate;
};

const getCountryFromIp = (ip) => {
	const geo = geoip.lookup(ip);
	if (!geo) {
		return '';
	}
	return `${geo.city ? `${geo.city}, ` : ''}${
		geo.country ? `${geo.country}` : ''
	}`;
};

const transport = () => {
	return nodemailer.createTransport({
		host: SMTP_SERVER,
		port: SMTP_PORT,
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASSWORD
		},
		logger: true,
	});
};

const sendSMTPEmail = (params) => {
	return transport().sendMail(params);
};

module.exports = {
	formatDate,
	getCountryFromIp,
	sendSMTPEmail
};
