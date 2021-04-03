'use strict';

const _ = require('lodash');
const packageJson = require('../../package.json');
const { Twitter } = require('../../db/models');

const getHealth = (req, res) => {
	Twitter.findAll({ raw: true }).then(console.log)
	return res.json({
		name: packageJson.name,
		version: packageJson.version,
		basePath: req.swagger.swaggerObject.basePath
	});
};

module.exports = {
	getHealth
};
