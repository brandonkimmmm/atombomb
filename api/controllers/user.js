'use strict';

const jwt = require('jsonwebtoken');
const { findUserByEmail } = require('../helpers/user');
const { User } = require('../../database/models');

const createUser = (req, res) => {
	const { email, password } = req.swagger.params.data.value;

	findUserByEmail(email)
		.then((user) => {
			if (user) throw new Error('User already exists');
			return User.create({ email, password });
		})
		.then((user) => {
			return res.status(201).json({ email: user.email });
		})
		.catch((err) => {
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const loginUser = (req, res) => {
	const { email, password } = req.swagger.params.data.value;

	findUserByEmail(email)
		.then(async (user) => {
			if (!user) throw new Error('User does not exist');
			if (!await user.validPassword(password, user.password)) throw new Error('Invalid password');
			return res.json({
				token: jwt.sign({
					id: user.id,
					email: user.email
				}, 'nahnah', { expiresIn: '24h' })
			});
		})
		.catch((err) => {
			return res.status(err.status || 400).json({ message: err.message });
		});
};

module.exports = {
	createUser,
	loginUser
};
