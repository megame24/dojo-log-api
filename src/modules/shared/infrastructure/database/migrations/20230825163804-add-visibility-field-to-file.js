"use strict";
const { Visibility } = require("../models/json/enums.json");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Files", "visibility", {
      type: Sequelize.ENUM(Visibility),
      allowNull: false,
      defaultValue: "private",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Files", "visibility");
  },
};
