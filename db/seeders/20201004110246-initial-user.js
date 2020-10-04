'use strict';

const moment = require('moment');
const currentTime = moment().toISOString();
const bcrypt = require('bcryptjs');
const { SALT_ROUNDS } = require('../../constants');
const salt = bcrypt.genSaltSync(SALT_ROUNDS);

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Users', [{
			email: 'bkim2490@gmail.com',
			password: bcrypt.hashSync('asdfasdf1234', salt),
			createdAt: currentTime,
			updatedAt: currentTime
		}]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Users', null, {});
	}
};
