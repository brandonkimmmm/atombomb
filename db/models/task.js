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
		bomb: {
			type: DataTypes.JSONB,
			defaultValue: {}
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