"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("GoalNotifications");
    if (tableInfo.finalNotificationDate) {
      console.log("column finalNotificationDate already exists");
      return;
    }
    // Step 1: Add the column with allowNull: true
    await queryInterface.addColumn(
      "GoalNotifications",
      "finalNotificationDate",
      {
        type: Sequelize.DATE,
        allowNull: true, // Initially allow null values
      }
    );

    // Step 2: Update existing records to set a default value
    await queryInterface.sequelize.query(`
      UPDATE "GoalNotifications"
      SET "finalNotificationDate" = NOW()
      WHERE "finalNotificationDate" IS NULL
    `);

    // Step 3: Change the column to not allow null values
    await queryInterface.changeColumn(
      "GoalNotifications",
      "finalNotificationDate",
      {
        type: Sequelize.DATE,
        allowNull: false, // Now set allowNull to false
        defaultValue: Sequelize.NOW,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable("GoalNotifications");
    if (!tableInfo.finalNotificationDate) {
      console.log("column finalNotificationDate do not exist");
      return;
    }
    // Step 4: Remove the column in the down method
    await queryInterface.removeColumn(
      "GoalNotifications",
      "finalNotificationDate"
    );
  },
};
