'use strict';
module.exports = (sequelize, DataTypes) => {
	const VerificationCode = sequelize.define('VerificationCode', {
		code: {
			type: DataTypes.UUID,
			allowNull: false
		},
		verified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, {
		hooks: {
			afterUpdate: (code) => {
				if (code.verified) {
					sequelize.models.User.update({
						verificationLevel: 1
					}, {
						where: {
							id: code.userId
						}
					});
				}
			}
		}
	});
	VerificationCode.associate = function(models) {
		// associations can be defined here
		VerificationCode.belongsTo(models.User, {
			onDelete: 'CASCADE',
			foreignKey: 'userId'
		});
	};
	return VerificationCode;
};