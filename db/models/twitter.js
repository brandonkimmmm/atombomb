'use strict';

const { SECRET } = require('../../constants');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(SECRET);

module.exports = (sequelize, DataTypes) => {
	const Twitter = sequelize.define('Twitter', {
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			onDelete: 'CASCADE',
			references: {
				model: 'Users',
				key: 'id'
			}
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false
		},
		accessToken: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		accessTokenSecret: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		twitterId: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		timestamps: true,
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
			foreignKey: 'userId',
			as: 'user',
			targeKey: 'id',
			onDelete: 'CASCADE'
		});
	};

	return Twitter;
};