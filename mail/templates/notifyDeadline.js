'use strict';

const fetchMessage = (email, data, domain) => {
	return {
		html: html(email, data, domain),
		text: text(email, data, domain)
	};
};

const html = (email, data, domain) => {
	const { NOTIFYDEADLINE } = require('../strings/en');
	const { task, deadline } = data;
	return `
		<div>
			<p>
				${NOTIFYDEADLINE.GREETING(email)}
			</p>
			<p>
				${NOTIFYDEADLINE.BODY[1](task)}
			</p>
			<div>
				${NOTIFYDEADLINE.BODY[2](deadline)}
			</div>
			<p>
				${NOTIFYDEADLINE.BODY[3]}
			</p>
			<p>
				${NOTIFYDEADLINE.CLOSING[1]}<br />
				${NOTIFYDEADLINE.CLOSING[2]}
			</p>
		</div>
	`;
};

const text = (email, data, domain) => {
	const { NOTIFYDEADLINE } = require('../strings/en');
	const { task, deadline } = data;
	return `
		${NOTIFYDEADLINE.GREETING(email)}
		${NOTIFYDEADLINE.BODY[1](task)}
		${NOTIFYDEADLINE.BODY[2](deadline)}
		${NOTIFYDEADLINE.CLOSING[1]} ${NOTIFYDEADLINE.CLOSING[2]}
	`;
};

module.exports = fetchMessage;
