'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Tasks', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			title: {
				type: Sequelize.STRING,
				required: true
			},
			description: {
				type: Sequelize.STRING,
				required: true
			},
			deadline: {
				type: Sequelize.DATE,
				required: true
			},
			userId: {
				type: Sequelize.INTEGER,
				required: true
			},
			completed: {
				type: Sequelize.BOOLEAN,
				required: true,
				defaultValue: false
			},
			expired: {
				type: Sequelize.BOOLEAN,
				required: true,
				defaultValue: false
			},
			bomb: {
				type: Sequelize.JSONB,
				defaultValue: {}
			},
			deadlineChanges: {
				type: Sequelize.INTEGER,
				required: true,
				defaultValue: 0
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
		return queryInterface.dropTable('Tasks');
	}
};