'use strict';

const { SECRET } = require('../../constants');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(SECRET);

module.exports = (sequelize, DataTypes) => {
	const Twitter = sequelize.define('Twitter', {
		userId: {
			type: DataTypes.INTEGER,
			required: true,
		},
		username: {
			type: DataTypes.STRING,
			required: true
		},
		accessToken: {
			type: DataTypes.TEXT,
			required: true
		},
		accessTokenSecret: {
			type: DataTypes.TEXT,
			required: true
		},
		twitterId: {
			type: DataTypes.STRING,
			required: true
		}
	}, {
		hooks: {
			beforeCreate: (twitter) => {
				twitter.accessToken = cryptr.encrypt(twitter.accessToken);
				twitter.accessTokenSecret = cryptr.encrypt(twitter.accessTokenSecret);
			}
		}
	});
	Twitter.associate = function(models) {
		// associations can be defined here
		Twitter.belongsTo(models.User, {
			foreignKey: 'userId'
		});
	};

	return Twitter;
};