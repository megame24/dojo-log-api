"use strict";

const { LogbookVisibility } = require("../models/json/enums.json");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Logbooks", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
        references: {
          model: "Users",
          key: "id",
        },
      },
      categoryId: {
        allowNull: false,
        type: DataTypes.UUID,
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
        references: {
          model: "Categories",
          key: "id",
        },
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      visibility: {
        type: DataTypes.ENUM(LogbookVisibility),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Logbooks");
  },
};
