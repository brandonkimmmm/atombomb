'use strict';

const {
	EMAIL_ICONS
} = require('../../constants');
const { DOMAIN } = require('../../../constants');

const styles = require('./styles');

exports.Button = (link, text) => `
	<div style="${styles.buttonWrapper}">
		<a href="${link}" target="_blank">
			<Button style="${styles.button}">${text}</Button>
		</a>
	</div>
`;

const footerTemplate = (domain = DOMAIN) => {
	const { FOOTER } = require('../../strings/en');
	return `
		<div style="${styles.footer}">
			<div style="float: left">
				<a style="${styles.link}" href="${domain}">${FOOTER.TERMS}</a>
				<p>${FOOTER.INVITE_YOUR_FRIENDS} <a style="${styles.link_blue}" href="${domain}">${domain}</a><p>
			</div>
			<div style="float: right; font-size: 8px; text-align: right;">
				<div>
					<a href="${'https://twitter.com'}">
						<img style="padding-right: 5px" src="${EMAIL_ICONS.TWITTER}" height="20"/>
					</a>
					<a href="${'https://facebook.com'}">
						<img src="${EMAIL_ICONS.FACEBOOK}" height="20"/>
					</a>
				</div>
			</div>
		</div>
	`;
};

const LOGO_TEMPLATE = ({ domain = DOMAIN }) => `
	<div style="${styles.logo}">
		<a href="${domain}"><img src="${EMAIL_ICONS.LOGO}" height="40"/></a>
	</div>
`;

const HEADER_TEMPLATE = ({ title, imagePath = '' }) => `
	<div style="${styles.header}">
		${imagePath &&
				`
		<div style="${styles.header_icon_wrapper}">
			<img style="${styles.header_icon}" src="${imagePath}"/>
		</div>
		`}
		<div style="${styles.header_icon_title}">${title}</div>
	</div>
`;


exports.TemplateEmail = (
	headerProps = {},
	content = '',
	domain = DOMAIN
) => {
	const bodyStyle = styles.body.concat('');

	return `
	<div style="${bodyStyle}">
		<div style="${styles.wrapper}">
			${LOGO_TEMPLATE(domain)}
			<div style="${styles.box_shadow}">
				${HEADER_TEMPLATE(headerProps)}
				<div style="${styles.container}">
					${content}
				</div>
				${footerTemplate(domain)}
			</div>
		</div>
	</div>
`;
};
