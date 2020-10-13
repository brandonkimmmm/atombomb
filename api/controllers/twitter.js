'use strict';

const { twitterOauth } = require('../../utils/oauth');
const { loggerTwitter } = require('../../config/logger');
const redis = require('../../db/redis');
const { TWITTER_OAUTH_KEY } = require('../../constants');
const { Twitter, sequelize } = require('../../db/models');
const { all } = require('bluebird');

const getRequestToken = (req, res) => {
	loggerTwitter.verbose(req.uuid, 'controllers/twitter/getRequestToken auth', req.auth.sub);

	const { id } = req.auth.sub;
	const { username } = req.swagger.params.username.value;

	sequelize.transaction((transaction) => {
		return Twitter.create({
			userId: id,
			username
		}, { transaction })
			.then(() => {
				return twitterOauth.getOAuthRequestTokenAsync();
			})
			.then(([
				oauthRequestToken,
				oauthRequestTokenSecret,
				{ oauth_callback_confired }
			]) => {
				if (!oauth_callback_confired) {
					throw new Error('OAuth callback not confirmed');
				}
				const oauthRequestData = JSON.stringify({
					oauthRequestToken,
					oauthRequestTokenSecret
				});
				return all([
					oauthRequestToken,
					redis.hsetAsync(TWITTER_OAUTH_KEY, username, oauthRequestData)
				]);
			});
	})
		.then(([ oauthRequestToken ]) => {
			return res.redirect(`https://twitter.com/oauth/authorize?oauth_token=${oauthRequestToken}`);
		})
		.catch((err) => {
			loggerTwitter.error('controllers/twitter/getRequestToken', 'Something went wrong');
			return res.status(err.statusCode || 400).json({ message: err.message || 'Something went wrong' });
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