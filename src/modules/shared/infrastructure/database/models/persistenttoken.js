"use strict";
const { Model } = require("sequelize");
const { TokenType } = require("./json/enums.json");

module.exports = (sequelize, DataTypes) => {
  class PersistentToken extends Model {
    static associate(models) {
      PersistentToken.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  PersistentToken.init(
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(TokenType),
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
