"use strict";
const { Model } = require("sequelize");
const { Visibility } = require("./json/enums.json");

module.exports = (sequelize, DataTypes) => {
  class Logbook extends Model {
    static associate(models) {
      Logbook.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "cascade",
      });
      Logbook.belongsTo(models.User, {
        foreignKey: "createdBy",
        onDelete: "SET NULL",
      });
      Logbook.belongsTo(models.User, {
        foreignKey: "updatedBy",
        onDelete: "SET NULL",
      });
      Logbook.belongsTo(models.Category, { foreignKey: "categoryId" });
      Logbook.hasMany(models.Log, {
        foreignKey: "logbookId",
        onDelete: "cascade",
      });
      Logbook.hasMany(models.Goal, {
        foreignKey: "logbookId",
        onDelete: "cascade",
      });
    }
  }
  Logbook.init(
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
      createdBy: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      updatedBy: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      categoryId: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      visibility: {
        type: DataTypes.ENUM(Visibility),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Logbook",
    }
  );
  return Logbook;
};
