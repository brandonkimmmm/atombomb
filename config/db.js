
'use strict';

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_DIALECT } = require('../constants');
const { loggerDb } = require('../config/logger');
const logging = (sql) => {
	loggerDb.debug(sql);
};

module.exports = {
	'development': {
		'username': DB_USER,
		'password': DB_PASSWORD,
		'database': DB_NAME,
		'host': DB_HOST,
		'port': DB_PORT,
		'dialect': DB_DIALECT,
		'operatorsAliases': false,
		logging
	},
	'test': {
		'username': DB_USER,
		'password': DB_PASSWORD,
		'database': DB_NAME,
		'host': DB_HOST,
		'port': DB_PORT,
		'dialect': DB_DIALECT,
		'operatorsAliases': false,
		logging
	},
	'production': {
		'username': DB_USER,
		'password': DB_PASSWORD,
		'database': DB_NAME,
		'host': DB_HOST,
		'port': DB_PORT,
		'dialect': DB_DIALECT,
		'operatorsAliases': false,
		logging
	}
};
