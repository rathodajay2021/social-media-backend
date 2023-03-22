'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: false,
        onDelete: "CASCADE",
        references : {
          model : "users",
          key : "id"
        }
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: false,
        onDelete: "CASCADE",
        references : {
          model : "post_data",
          key : "id"
        }
      },
      comment: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comments');
  }
};