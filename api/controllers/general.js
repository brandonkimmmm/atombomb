'use strict';

const packageJson = require('../../package.json');

const getHealth = (req, res) => {
	res.json({
		name: packageJson.name,
		version: packageJson.version,
		basePath: req.swagger.swaggerObject.basePath
	});
};

module.exports = {
	getHealth
};
