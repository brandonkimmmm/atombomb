'use strict';

const fetchMessage = (email, data, domain) => {
	return {
		html: html(email, data, domain),
		text: text(email, data, domain)
	};
};

const html = (email, data, domain) => {
	const { WELCOME } = require('../strings/en');
	return `
		<div>
			<p>
				${WELCOME.GREETING(email)}
			</p>
			<p>
				${WELCOME.BODY[1]}
			</p>
			<p>
				${WELCOME.BODY[2]}
			</p>
			<p>
				${WELCOME.CLOSING[1]}<br />
				${WELCOME.CLOSING[2]}
			</p>
		</div>
	`;
};

const text = (email, data, domain) => {
	const { WELCOME } = require('../strings/en');
	return `
		${WELCOME.GREETING(email)}
		${WELCOME.BODY[1]}
		${WELCOME.BODY[2]}
		${WELCOME.CLOSING[1]} ${WELCOME.CLOSING[2]}
	`;
};

module.exports = fetchMessage;
