"use strict";
const { goalRewards } = require("./config/seedData");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("GoalRewards", goalRewards);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("GoalRewards", null, {});
  },
};
