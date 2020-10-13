'use strict';

const { twitterOauth } = require('../../utils/oauth');
const { loggerTwitter } = require('../../config/logger');

let storedOauthToken;
let storedOauthTokenSecret;

const getRequestToken = (req, res) => {
	twitterOauth.getOAuthRequestToken((err, oauthToken, oauthTokenSecret, results) => {
		if (err) {
			loggerTwitter.error('controllers/twitter/getRequestToken', 'Something went wrong');
			return res.status(err.statusCode || 400).json({ message: 'Something went wrong' });
		}
		storedOauthToken = oauthToken;
		storedOauthTokenSecret = oauthTokenSecret;
		console.log(oauthToken, oauthTokenSecret);
		loggerTwitter.info('controllers/twitter/getRequestToken');
		return res.redirect(`https://twitter.com/oauth/authorize?oauth_token=${oauthToken}`);
	});
};

const getAccessToken = (req, res) => {

	twitterOauth.getOAuthAccessToken(
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