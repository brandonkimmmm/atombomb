'use strict';

const { User } = require('../../database/models');

const createUser = (req, res) => {
	const { email, password } = req.swagger.params.data.value;
	console.log(email, password)

	User.create({
		email,
		password
	})
		.then((user) => {
			return res.status(201).json({ email: user.email });
		})
		.catch((err) => {
			console.log(err)
			return res.status(err.status || 400).json({ message: err.message });
		});
};

const loginUser = (req, res) => {
	const { email, password } = req.swagger.params.data.value;

	User.findOne({
		where: { email }
	})
		.then((user) => {
			if (!user) throw new Error('User does not exist');
			return user.validPassword(password, user.password);
		})
		.then((passwordIsValid) => {
			if (!passwordIsValid) throw new Error('Invalid password');
			return res.json({ email });
		})
		.catch((err) => {
			console.log(err);
			return res.status(err.status || 400).json({ message: err.message });
		})
};

module.exports = {
	createUser,
	loginUser
};
