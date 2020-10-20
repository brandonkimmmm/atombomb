'use strict';

const fetchMessage = (email, data, domain) => {
	return {
		html: html(email, data, domain),
		text: text(email, data, domain)
	};
};

const html = (email, data, domain) => {
	const { LOGIN } = require('../strings/en');
	return `
		<div>
			<p>
				${LOGIN.GREETING(email)}
			</p>
			<p>
				${LOGIN.BODY[1]}
			</p>
			<div>
				${data.time ? `<div>${LOGIN.BODY[2](data.time)}</div>` : ''}
				${data.country ? `<div>${LOGIN.BODY[3](data.country)}</div>` : ''}
				${data.device ? `<div>${LOGIN.BODY[4](data.device)}</div>` : '' }
				${data.ip ? `<div>${LOGIN.BODY[5](data.ip)}</div>` : ''}
			</div>
			<p>
				${LOGIN.BODY[6]}
			</p>
			<p>
				${LOGIN.CLOSING[1]}<br />
				${LOGIN.CLOSING[2]}
			</p>
		</div>
	`;
};

const text = (email, data, domain) => {
	const { LOGIN } = require('../strings/en');
	return `
		${LOGIN.GREETING(email)}
		${LOGIN.BODY[1]}
		${data.time ? `<div>${LOGIN.BODY[2](data.time)}</div>` : ''}
		${data.country ? `<div>${LOGIN.BODY[3](data.country)}</div>` : ''}
		${data.device ? `<div>${LOGIN.BODY[4](data.device)}</div>` : ''}
		${data.ip ? `<div>${LOGIN.BODY[5](data.ip)}</div>` : ''}
		${LOGIN.BODY[6]}
		${LOGIN.CLOSING[1]} ${LOGIN.CLOSING[2]}
	`;
};

module.exports = fetchMessage;
