'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
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
				const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
				user.password = bcrypt.hashSync(user.password, salt);
			}
		}
	});
	User.associate = function(models) {
		// associations can be defined here
	};

	User.prototype.validPassword = (givenPassword, userPassword) => bcrypt.compare(givenPassword, userPassword);
	return User;
};