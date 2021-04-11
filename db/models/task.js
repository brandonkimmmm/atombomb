'use strict';

module.exports = (sequelize, DataTypes) => {
	const Task = sequelize.define('Task', {
		title: {
			type:DataTypes.STRING,
			required: true
		},
		description: {
			type: DataTypes.STRING,
			required: true
		},
		deadline: {
			type: DataTypes.DATE,
			required: true
		},
		userId: {
			type: DataTypes.INTEGER,
			required: true
		},
		status: {
			type: DataTypes.INTEGER,
			required: true,
			defaultValue: 0
		},
		bomb: {
			type: DataTypes.JSONB,
			defaultValue: {}
		},
		deadlineChanges: {
			type: DataTypes.INTEGER,
			required: true,
			defaultValue: 0
		}
	}, {});
	Task.associate = function(models) {
		Task.belongsTo(models.User, {
			foreignKey: 'userId'
		});
		// associations can be defined here
	};

	return Task;
};