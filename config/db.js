require('dotenv').config();

module.exports = {
	'development': {
		'username': 'postgres',
		'password': 'postgres',
		'database': 'atombomb-dev',
		'host': '127.0.0.1',
		'port': 5432,
		'dialect': 'postgres',
		'operatorsAliases': false
	},
	'test': {
		'username': 'postgres',
		'password': null,
		'database': 'database_test',
		'host': process.env.TEST_DATABASE_URL,
		'dialect': 'mysql',
		'operatorsAliases': false
	},
	'production': {
		'username': 'postgres',
		'password': null,
		'database': 'database_production',
		'host': process.env.DATABASE_URL,
		'dialect': 'mysql',
		'operatorsAliases': false
	}
};
