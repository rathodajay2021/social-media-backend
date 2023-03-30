"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.renameColumn("friends", "userId1", "senderId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: false,
    });
    await queryInterface.renameColumn("friends", "userId2", "receiverId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
