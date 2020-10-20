'use strict';

const { Button } = require('./helpers/common');

const fetchMessage = (email, data, domain) => {
	return {
		html: html(email, data, domain),
		text: text(email, data, domain)
	};
};

const html = (email, data, domain) => {
	const link = `${domain}/verify/${data}`;
	const { SIGNUP } = require('../strings/en');
	return `
		<div>
			<p>
				${SIGNUP.GREETING(email)}
			</p>
			<p>
				${SIGNUP.BODY[1]}
			</p>
			<p>
				${SIGNUP.BODY[2]}
			</p>
			${Button(link, SIGNUP.BODY[3])}
			<p>
				${SIGNUP.CLOSING[1]}<br />
				${SIGNUP.CLOSING[2]}
			</p>
		</div>
	`;
};

const text = (email, data, domain) => {
	const link = `${domain}/verify/${data}`;
	const { SIGNUP } = require('../strings/en');
	return `
		${SIGNUP.GREETING(email)}
		${SIGNUP.BODY[1]}
		${SIGNUP.BODY[2]}
		${SIGNUP.BODY[3]}(${link})
		${SIGNUP.CLOSING[1]} ${SIGNUP.CLOSING[2]}
	`;
};

module.exports = fetchMessage;
