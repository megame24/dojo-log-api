"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Goal extends Model {
    static associate(models) {
      Goal.belongsTo(models.Logbook, {
        foreignKey: "logbookId",
        onDelete: "cascade",
      });
      Goal.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "cascade",
      });
      Goal.belongsTo(models.User, {
        foreignKey: "createdBy",
        onDelete: "SET NULL",
      });
      Goal.belongsTo(models.User, {
        foreignKey: "updatedBy",
        onDelete: "SET NULL",
      });
      Goal.belongsToMany(models.Reward, {
        through: "GoalRewards",
        foreignKey: "goalId",
        onDelete: "cascade",
      });
    }
  }
  Goal.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      achieved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      achievementCriteria: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Goal",
    }
  );
  return Goal;
};
