'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Twitters', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		userId: {
			type: Sequelize.INTEGER,
			required: true
		},
		username: {
			type: Sequelize.STRING,
			required: true
		},
		acccessToken: {
			type: Sequelize.STRING
		},
		twitterId: {
			type: Sequelize.INTEGER
		},
		createdAt: {
			allowNull: false,
			type: Sequelize.DATE
		},
		updatedAt: {
			allowNull: false,
			type: Sequelize.DATE
		}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Twitters');
	}
};