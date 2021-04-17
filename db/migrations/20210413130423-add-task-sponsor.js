'use strict';

const TABLE = 'Tasks';
const COLUMN = 'sponsorId';

module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.addColumn(
			TABLE,
			COLUMN,
			{
				allowNull: true,
				type: Sequelize.INTEGER,
				references: {
					model: 'Users',
					key: 'id'
				}
			}
	),
	down: (queryInterface) => queryInterface.removeColumn(
		TABLE,
		COLUMN
    )
};