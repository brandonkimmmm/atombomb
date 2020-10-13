
'use strict';

const { twitterOauth } = require('../../utils/oauth');
const { loggerTwitter } = require('../../config/logger');
const redis = require('../../db/redis');
const { TWITTER_OAUTH_KEY } = require('../../constants');
const { Twitter } = require('../../db/models');
const { all } = require('bluebird');

const getRequestToken = (req, res) => {
	loggerTwitter.verbose(req.uuid, 'controllers/twitter/getRequestToken auth', req.auth.sub);

	const { id } = req.auth.sub;

	twitterOauth.getOAuthRequestTokenAsync()
		.then(([
			oauthRequestToken,
			oauthRequestTokenSecret,
			{ oauth_callback_confirmed }
		]) => {
			if (!oauth_callback_confirmed) {
				throw new Error('OAuth callback not confirmed');
			}
			const oauthRequestData = JSON.stringify({
				oauthRequestToken,
				oauthRequestTokenSecret,
				id
			});
			return all([
				oauthRequestToken,
				redis.hsetAsync(TWITTER_OAUTH_KEY, oauthRequestToken, oauthRequestData)
			]);
		})
		.then(([ oauthRequestToken ]) => {
			return res.redirect(`https://twitter.com/oauth/authorize?oauth_token=${oauthRequestToken}`);
		})
		.catch((err) => {
			loggerTwitter.error(req.uuid, 'controllers/twitter/getRequestToken', err.message || 'Something went wrong');
			return res.status(err.statusCode || 400).json({ message: err.message || 'Something went wrong' });
		});
};


const getAccessToken = (req, res) => {
	const { oauth_verifier, oauth_token } = req.swagger.params.oauth_verifier.value;

	loggerTwitter.verbose(req.uuid, 'controllers/twitter/getAccessToken verifier', oauth_verifier);

	redis.hgetAsync(TWITTER_OAUTH_KEY, oauth_token)
		.then((requestData) => {
			if (!requestData) {
				throw new Error('Invalid request token');
			}

			requestData = JSON.parse(requestData);

			return all([
				requestData.id,
				twitterOauth.getOAuthAccessTokenAsync(
					requestData.oauthRequestToken,
					requestData.oauthRequestTokenSecret,
					oauth_verifier
				)
			]);
		})
		.then(([ id, [ oauthAccessToken, oauthAccessTokenSecret, { user_id, screen_name } ] ]) => {
			return Twitter.create({
				userId: id,
				username: screen_name,
				accessToken: oauthAccessToken,
				accessTokenSecret: oauthAccessTokenSecret,
				twitterId: user_id
			});
		})
		.then(() => {
			return res.redirect('http://127.0.0.1:3000?alert=Twitter&Verified');
		})
		.catch((err) => {
			loggerTwitter.error(req.uuid, 'controllers/twitter/getAccessToken', err.message || 'Something went wrong');
			return res.status(err.statusCode || 400).json({ message: err.message || 'Something went wrong' });
		});
};

module.exports = {
	getRequestToken,
	getAccessToken
};