'use strict';

const bcrypt = require('bcryptjs');
require('dotenv').config();

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		name: {
			type: DataTypes.STRING,
			required: true
		},
		email: {
			type: DataTypes.STRING,
			required: true
		},
		password: {
			type: DataTypes.STRING,
			required: true
		}
	}, {
		hooks: {
			beforeCreate: (user) => {
				const salt = bcrypt.genSaltSync(process.env.SALT_ROUNDS);
				user.password = bcrypt.hashSync(user.password, salt);
			}
		},
		instanceMethods: {
			validPassword(password) {
				return bcrypt.compare(password, this.password)
			}
		}
	});
	User.associate = function(models) {
		// associations can be defined here
	};
	return User;
};