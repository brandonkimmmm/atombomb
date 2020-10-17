'use strict';

const { SECRET } = require('../constants');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(SECRET);

module.exports = {
	cryptr
};