"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    static associate(models) {
      Log.belongsTo(models.Logbook, {
        foreignKey: "logbookId",
        onDelete: "cascade",
      });
      Log.belongsTo(models.User, { foreignKey: "userId" });
      Log.belongsTo(models.User, { foreignKey: "cratedBy" });
      Log.belongsTo(models.User, { foreignKey: "updatedBy" });
      Log.hasMany(models.File, { foreignKey: "logId" });
    }
  }
  Log.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      logbookId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      createdBy: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      updatedBy: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      durationOfWorkInMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Log",
    }
  );
  return Log;
};
