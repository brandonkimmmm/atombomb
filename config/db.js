
'use strict';

const { loggerDb } = require('../config/logger');
const logging = (sql) => {
	loggerDb.debug(sql);
};

module.exports = {
	'development': {
		'username': 'postgres',
		'password': 'postgres',
		'database': 'atombomb-dev',
		'host': '127.0.0.1',
		'port': 5432,
		'dialect': 'postgres',
		'operatorsAliases': false,
		logging
	},
	'test': {
		'username': 'postgres',
		'password': null,
		'database': 'database_test',
		'host': process.env.TEST_DATABASE_URL,
		'dialect': 'mysql',
		'operatorsAliases': false,
		logging
	},
	'production': {
		'username': 'postgres',
		'password': null,
		'database': 'database_production',
		'host': process.env.DATABASE_URL,
		'dialect': 'mysql',
		'operatorsAliases': false,
		logging
	}
};
