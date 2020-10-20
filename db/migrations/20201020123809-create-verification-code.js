'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('VerificationCodes', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		code: {
			type: Sequelize.UUID,
			allowNull: false
		},
		userId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			onDelete: 'CASCADE'
		},
		verified: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
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
		return queryInterface.dropTable('VerificationCodes');
	}
};