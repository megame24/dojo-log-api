"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      File.belongsTo(models.User, { foreignKey: "userId" });
      File.belongsTo(models.Log, { foreignKey: "logId" });
      File.belongsTo(models.Reward, { foreignKey: "rewardId" });
    }
  }
  File.init(
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
      logId: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      rewardId: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "File",
    }
  );
  return File;
};
