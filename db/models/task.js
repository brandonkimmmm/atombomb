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

	Task.prototype.changedDeadline = () => {
		if (this.deadlineChanges === 3) {
			throw new Error('Cannot change deadline anymore');
		} else {
			const deadlineChanges = this.deadlineChanges++;
			this.set('deadlineChanges', deadlineChanges).save();
		}
	};

	return Task;
};