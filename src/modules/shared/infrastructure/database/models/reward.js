"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Reward extends Model {
    static associate(models) {
      Reward.belongsToMany(models.Goal, {
        through: "GoalRewards",
        foreignKey: "rewardId",
        onDelete: "cascade",
      });
      Reward.belongsTo(models.User, { foreignKey: "userId" });
      Reward.belongsTo(models.User, { foreignKey: "createdBy" });
      Reward.belongsTo(models.User, { foreignKey: "updatedBy" });
      Reward.hasMany(models.File, { foreignKey: "rewardId" });
    }
  }
  Reward.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdBy: {
        allowNull: true,
        type: DataTypes.UUID,
      },
      updatedBy: {
        allowNull: true,
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      modelName: "Reward",
    }
  );
  return Reward;
};
