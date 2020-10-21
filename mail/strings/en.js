'use strict';

const COMMON = {
	GREETING: (name) => `Dear ${name}`,
	CLOSING: {
		1: 'Regards',
		2: 'Atom Bomb team'
	},
	IP_ADDRESS: (ip) => `IP Address: ${ip}`,
	IP_REQUEST_FROM: (ip) => `Request initiated from: ${ip}`,
	TIME: (time) => `Time: ${time}`,
	COUNTRY: (country) => `Country: ${country}`,
	DEVICE: (device) => `Device: ${device}`
};

const FOOTER = {
	FOLLOW_US: 'Follow us on',
	NEED_HELP: 'Need help? Just reply to this email',
	PRIVACY_POLICY: 'Privacy policy',
	TERMS: 'Terms and conditions',
	INVITE_YOUR_FRIENDS: 'Invite your friends',
};

const WELCOME = {
	TITLE: 'Welcome',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Thank you for signing up to Atom Bomb.',
		2: 'If you have any questions or concerns, please contact us simply by replying to this email.'
	},
	CLOSING: COMMON.CLOSING
};

const SIGNUP = {
	TITLE: 'Sign Up',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: `You need to confirm your email account by clicking the button below.
			If you have any questions feel free to contact us simply by replying to this email.`,
		2: 'Please click on the button below to proceed with your registration.',
		3: 'Confirm'
	},
	CLOSING: COMMON.CLOSING
};

const LOGIN = {
	TITLE: 'Login',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'We have recorded a login to your account with the following details',
		2: (time) => COMMON.TIME(time),
		3: (country) => COMMON.COUNTRY(country),
		4: (device) => COMMON.DEVICE(device),
		5: (ip) => COMMON.IP_ADDRESS(ip),
		6: 'If this was not you, please change your password and contact us immediately.'
	},
	CLOSING: COMMON.CLOSING
};

const RESETPASSWORD = {
	TITLE: 'Reset Password Request',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'You have made a request to reset the password for your account.',
		2: 'To update your password, click on the link below.',
		3: 'Reset My Password',
		4: COMMON.ERROR_REQUEST,
		5: (ip) => COMMON.IP_REQUEST_FROM(ip)
	},
	CLOSING: COMMON.CLOSING
};

const ACCOUNTVERIFY = {
	TITLE: 'Account Verified',
	GREETING: (name) => COMMON.GREETING(name),
	BODY: {
		1: 'Congratulations. Your account is verified successfully.',
		2: 'Trade Now'
	},
	CLOSING: COMMON.CLOSING
};

const CONTACTFORM = {
	TITLE: 'Contact Form',
	BODY: {
		1: 'Contact Form Data',
		2: (email) =>
			`The client with email ${email} has submitted the contact form.`,
		3: (data) => `${JSON.stringify(data, null, 2)}`
	}
};

const BOMB = {
	TITLE: (email) => `${email} Failed to Complete a Task`,
	GREETING: (sentEmail) => COMMON.GREETING(sentEmail),
	BODY: {
		1: (email) => `This email is regarding the person with email ${email}`,
		2: (task, deadline) => `I've failed to complete the task of ${task} by the deadline ${deadline}`,
		3: (description) => `Task description: ${description}`,
		4: (message) => `${message}`,
		5: 'Please remind me to complete my tasks on time in the future'
	},
	CLOSING: COMMON.CLOSING
};

const NOTIFYDEADLINE  = {
	TITLE: 'Task Deadline Approaching',
	GREETING: (email) => COMMON.GREETING(email),
	BODY: {
		1: (task) => `Your task ${task} is going to be due in one day`,
		2: (deadline) => `Deadline: ${deadline}`,
		3: 'Your bombs will be posted/sent by this time tomorrow. Make sure to complete your task!'
	},
	CLOSING: COMMON.CLOSING
};

module.exports = {
	FOOTER,
	WELCOME,
	COMMON,
	SIGNUP,
	LOGIN,
	RESETPASSWORD,
	ACCOUNTVERIFY,
	CONTACTFORM,
	BOMB,
	NOTIFYDEADLINE
};
