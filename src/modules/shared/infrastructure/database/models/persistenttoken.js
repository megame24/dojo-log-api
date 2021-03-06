"use strict";
const { Model } = require("sequelize");
const { TokenOrCodeType } = require("./json/enums.json");

module.exports = (sequelize, DataTypes) => {
  class PersistentToken extends Model {
    static associate(models) {
      PersistentToken.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  PersistentToken.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(TokenOrCodeType),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PersistentToken",
    }
  );
  return PersistentToken;
};
