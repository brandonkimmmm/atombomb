'use strict';

const bcrypt = require('bcryptjs');
const { SALT_ROUNDS } = require('../../constants');

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		verified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false
		}
	}, {
		timestamps: true,
		hooks: {
			beforeCreate: (user) => {
				const salt = bcrypt.genSaltSync(SALT_ROUNDS);
				user.password = bcrypt.hashSync(user.password, salt);
			}
		}
	});
	User.associate = function(models) {
		// associations can be defined here
		User.hasMany(models.Task, {
			foreignKey: 'userId',
			as: 'tasks'
		});
		User.hasOne(models.Twitter, {
			foreignKey: 'userId',
			as: 'twitter'
		});
		User.hasMany(models.Task, {
			foreignKey: 'sponsorId',
			as: 'sponsoredTasks'
		});
	};

	User.prototype.validPassword = (givenPassword, userPassword) => bcrypt.compare(givenPassword, userPassword);
	return User;
};