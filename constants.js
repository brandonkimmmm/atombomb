'use strict';

require('dotenv').config();


exports.SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 8;
exports.SECRET = process.env.SECRET || 'shhh';

exports.TWITTER_API_KEY = process.env.TWITTER_API_KEY;
exports.TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;