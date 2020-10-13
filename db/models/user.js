'use strict';

const bcrypt = require('bcryptjs');
const { SALT_ROUNDS } = require('../../constants');

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		email: {
			type: DataTypes.STRING,
			required: true,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			required: true
		}
	}, {
		hooks: {
			beforeCreate: (user) => {
				const salt = bcrypt.genSaltSync(SALT_ROUNDS);
				user.password = bcrypt.hashSync(user.password, salt);
			}
		}
	});
	User.associate = function(models) {
		// associations can be defined here
		User.hasMany(models.Task, { foreignKey: 'userId' });
		User.hasOne(models.Twitter, { foreignKey: 'userId' });
	};

	User.prototype.validPassword = (givenPassword, userPassword) => bcrypt.compare(givenPassword, userPassword);
	return User;
};