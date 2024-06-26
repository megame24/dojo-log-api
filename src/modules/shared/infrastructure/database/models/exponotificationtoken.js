"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ExpoNotificationToken extends Model {
    static associate(models) {
      ExpoNotificationToken.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "cascade",
      });
    }
  }
  ExpoNotificationToken.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      modelName: "ExpoNotificationToken",
      indexes: [
        {
          name: "token_index",
          fields: ["token"],
        },
      ],
    }
  );
  return ExpoNotificationToken;
};
