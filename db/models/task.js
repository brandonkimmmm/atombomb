'use strict';

module.exports = (sequelize, DataTypes) => {
	const Task = sequelize.define('Task', {
		action: {
			type:DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false
		},
		deadline: {
			type: DataTypes.DATE,
			allowNull: false
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			onDelete: 'CASCADE',
			references: {
				model: 'Users',
				key: 'id'
			}
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		bomb: {
			type: DataTypes.JSONB,
			defaultValue: {},
			allowNull: false
		},
		deadlineChanges: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		sponsorId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'Users',
				key: 'id'
			}
		}
	}, {
		timestamps: true
	});
	Task.associate = function(models) {
		Task.belongsTo(models.User, {
			foreignKey: 'userId',
			targetKey: 'id',
			onDelete: 'CASCADE',
			as: 'user'
		});

		Task.belongsTo(models.User, {
			foreignKey: 'sponsorId',
			as: 'sponsor',
			targetKey: 'id'
		});
	};

	return Task;
};