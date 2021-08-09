"use strict";
const { Model } = require("sequelize");
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
    },
    {
      sequelize,
      modelName: "PersistentToken",
    }
  );
  return PersistentToken;
};
