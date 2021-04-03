'use strict';

require('dotenv').config();

exports.DOMAIN = process.env.DOMAIN || 'http://localhost:3000';

exports.DB_HOST = process.env.DB_HOST || '127.0.0.1';
exports.DB_PORT = process.env.DB_PORT || 5432;
exports.DB_NAME = process.env.DB_NAME || 'atombomb';
exports.DB_USER = process.env.DB_USER || 'admin';
exports.DB_PASSWORD = process.env.DB_PASSWORD || 'root';
exports.DB_DIALECT = process.env.DB_DIALECT || 'postgres';

exports.SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 8;
exports.SECRET = process.env.SECRET || 'shhh';

exports.TWITTER_API_KEY = process.env.TWITTER_API_KEY;
exports.TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;

exports.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
exports.REDIS_PORT = process.env.REDIS_PORT || 6379;

exports.TWITTER_OAUTH_KEY = 'twitter:oauth';

exports.CONNECTED_SOCIAL_MEDIA = [
	'twitter'
];

exports.SENDER_EMAIL = process.env.SENDER_EMAIL || 'bkim2490@gmail.com';
exports.SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'bkim2490@gmail.com';

exports.DEFAULT_TIMEZONE = 'Asia/Seoul';

exports.SMTP_SERVER = process.env.SMTP_SERVER;
exports.SMTP_PORT = process.env.SMTP_PORT;
exports.SMTP_USER = process.env.SMTP_USER;
exports.SMTP_PASSWORD = process.env.SMTP_PASSWORD;

exports.DOMAIN = process.env.DOMAIN || 'http://localhost';

exports.EMAIL_ICONS = {
	LOGO: 'https://previews.123rf.com/images/vectorstockcompany/vectorstockcompany1808/vectorstockcompany180817136/108633588-bomb-vector-icon-isolated-on-transparent-background-bomb-logo-concept.jpg',
	EMAIL_ICON: 'https://i.pinimg.com/originals/c3/0e/ee/c30eee73a5e3d31b072f555985175165.jpg',
	FACEBOOK: 'https://w7.pngwing.com/pngs/286/412/png-transparent-facebook-scalable-graphics-icon-facebook-logo-facebook-logo-blue-logo-electric-blue.png',
	TWITTER: 'https://i.pinimg.com/474x/ee/4b/ec/ee4bec98e284c251b885707a470ad3b8.jpg'
};