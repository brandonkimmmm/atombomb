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
				allowNull: false,
				onDelete: 'CASCADE',
				references: {
					model: 'Users',
					key: 'id'
				}
			},
			username: {
				type: Sequelize.STRING,
				allowNull: false
			},
			accessToken: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			accessTokenSecret: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			twitterId: {
				type: Sequelize.STRING,
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
		return queryInterface.dropTable('Twitters');
	}
};