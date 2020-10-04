'use strict';

exports.SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 8;
exports.SECRET = process.env.SECRET || 'shhh';