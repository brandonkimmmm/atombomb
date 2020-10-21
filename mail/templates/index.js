'use strict';

const { DOMAIN } = require('../../constants');
const { TemplateEmail } = require('./helpers/common');
const { MAILTYPE } = require('../strings');

const generateMessageContent = (
	type,
	email,
	data = {},
	domain = DOMAIN
) => {
	const STRINGS = require('../strings/en');
	let title;
	if (type === MAILTYPE.BOMB) {
		title = STRINGS[type.toUpperCase()].TITLE(email);
	} else {
		title = STRINGS[type.toUpperCase()].TITLE;
	}
	const subject = `Atom Bomb ${title}`;
	const message = require(`./${type}`)(email, data, domain);
	const result = {
		subject: subject,
		html: TemplateEmail({ title }, message.html, domain),
		text: message.text
	};
	return result;
};

module.exports = generateMessageContent;
