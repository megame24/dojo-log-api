"use strict";
const { Model } = require("sequelize");
const { TokenOrCodeType } = require("./json/enums.json");

module.exports = (sequelize, DataTypes) => {
  class PersistentCode extends Model {
    static associate(models) {
      PersistentCode.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  PersistentCode.init(
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
      encryptedCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(TokenOrCodeType),
        allowNull: false,
      },
      expiresIn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PersistentCode",
    }
  );
  return PersistentCode;
};
