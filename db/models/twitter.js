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
		acccessToken: {
			type: DataTypes.STRING,
			required: true
		},
		accessTokenSecret: {
			type: DataTypes.STRING,
			required: true
		},
		twitterId: {
			type: DataTypes.INTEGER,
			required: true
		}
	}, {
		hooks: {
			beforeCreate: (twitter) => {
				twitter.acccessToken = cryptr.encrypt(twitter.acccessToken);
				twitter.acccessTokenSecret = cryptr.encrypt(twitter.acccessTokenSecret);
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