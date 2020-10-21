'use strict';

const fetchMessage = (email, data, domain) => {
	return {
		html: html(email, data, domain),
		text: text(email, data, domain)
	};
};

const html = (email, data, domain) => {
	const { BOMB } = require('../strings/en');
	const { sentEmail, task, message, deadline } = data;
	return `
		<div>
			<p>
				${BOMB.GREETING(sentEmail)}
			</p>
			<p>
				${BOMB.BODY[1](email)}
			</p>
			<p>
				${BOMB.BODY[2](task, deadline)}
			</p>
			<div>
				${BOMB.BODY[3](message)}
			</div>
			<p>
				${BOMB.BODY[4]}
			</p>
			<p>
				${BOMB.CLOSING[1]}<br />
				${BOMB.CLOSING[2]}
			</p>
		</div>
	`;
};

const text = (email, data, domain) => {
	const { BOMB } = require('../strings/en');
	const { sentEmail, task, message, deadline } = data;
	return `
		${BOMB.GREETING(sentEmail)}
		${BOMB.BODY[1](email)}
		${BOMB.BODY[2](task, deadline)}
		${BOMB.BODY[3](message)}
		${BOMB.BODY[4]}
		${BOMB.CLOSING[1]} ${BOMB.CLOSING[2]}
	`;
};

module.exports = fetchMessage;
