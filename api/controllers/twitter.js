'use strict';

const OAuth = require('oauth');
const { TWITTER_API_KEY, TWITTER_API_SECRET } = require('../../constants');

let storedOauthToken;
let storedOauthTokenSecret;

const getRequestToken = (req, res) => {
	const oauth = new OAuth.OAuth(
		'https://twitter.com/oauth/request_token',
		'https://twitter.com/oauth/access_token',
		TWITTER_API_KEY,
		TWITTER_API_SECRET,
		'1.0A',
		'http://127.0.0.1:10010/twitter/callback',
		'HMAC-SHA1'
	);

	oauth.getOAuthRequestToken((err, oauthToken, oauthTokenSecret, results) => {
		if (err) {
			console.log(err)
			return res.status(err.statusCode || 400).json({ message: 'Something went wrong' });
		}
		storedOauthToken = oauthToken;
		storedOauthTokenSecret = oauthTokenSecret;
		return res.redirect(`https://twitter.com/oauth/authorize?oauth_token=${oauthToken}`);
	});
};

const getAccessToken = (req, res) => {
	const oauth = new OAuth.OAuth(
		'https://twitter.com/oauth/request_token',
		'https://twitter.com/oauth/access_token',
		TWITTER_API_KEY,
		TWITTER_API_SECRET,
		'1.0A',
		'http://127.0.0.1:10010/twitter/callback',
		'HMAC-SHA1'
	);

	console.log(req.swagger.params)

	oauth.getOAuthAccessToken(
		storedOauthToken,
		storedOauthTokenSecret,
		req.swagger.params.oauth_verifier.value,
		(err, oauthAccessToken, oauthAccessTokenSecret, results) => {
			if (err) {
				console.log(err)
				return res.status(err.statusCode || 400).json({ message: 'Something went wrong' });
			}
			console.log(oauthAccessToken, oauthAccessTokenSecret, results)
		}
	);
};

module.exports = {
	getRequestToken,
	getAccessToken
};