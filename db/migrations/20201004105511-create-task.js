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
				allowNull: false
			},
			description: {
				type: Sequelize.STRING,
				allowNull: false
			},
			deadline: {
				type: Sequelize.DATE,
				allowNull: false
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				onDelete: 'CASCADE',
				references: {
					model: 'Users',
					key: 'id'
				}
			},
			completed: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: false
			},
			expired: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: false
			},
			bomb: {
				type: Sequelize.JSONB,
				defaultValue: {},
				allowNull: false
			},
			deadlineChanges: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()')
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()')
			}
		}, {
			timestamps: true
		});
	},
	down: (queryInterface) => {
		return queryInterface.dropTable('Tasks');
	}
};