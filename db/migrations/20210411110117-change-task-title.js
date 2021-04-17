'use strict';

const TABLE = 'Tasks';
const COLUMN_1 = 'title';
const COLUMN_2 = 'action';

module.exports = {
	up: (queryInterface) => {
		return queryInterface.renameColumn(
      TABLE,
      COLUMN_1,
      COLUMN_2
    );
	},
	down: (queryInterface) => {
		return queryInterface.renameColumn(
      TABLE,
      COLUMN_2,
      COLUMN_1
    );
	}
};