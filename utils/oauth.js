'use strict';

const OAuth = require('oauth');
const { TWITTER_API_KEY, TWITTER_API_SECRET } = require('../constants');

const twitterOauth = new OAuth.OAuth(
	'https://twitter.com/oauth/request_token',
	'https://twitter.com/oauth/access_token',
	TWITTER_API_KEY,
	TWITTER_API_SECRET,
	'1.0A',
	'http://127.0.0.1:10010/twitter/callback',
	'HMAC-SHA1'
);

module.exports = {
	twitterOauth
};