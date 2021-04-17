'use strict';

const { all, resolve } = require('bluebird');
const TABLE = 'Tasks';
const COLUMN_1 = 'status';
const COLUMN_2 = 'completed';
const COLUMN_3 = 'expired';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
      TABLE,
      COLUMN_1,
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    )
      .then(() => {
        return queryInterface.sequelize.query (`
          UPDATE "${TABLE}" SET
          ${COLUMN_1} =
            CASE
              WHEN (${COLUMN_2} = true AND ${COLUMN_3} = false) THEN 1
              WHEN (${COLUMN_2} = false AND ${COLUMN_3} = true) THEN -1
              ELSE 0
            END
        `);
      })
      .then(() => {
        return all([
          queryInterface.removeColumn(TABLE, COLUMN_2),
          queryInterface.removeColumn(TABLE, COLUMN_3)
        ]);
      });
	},
	down: () => {
		return resolve();
	}
};