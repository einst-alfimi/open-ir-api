'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: { // login_id
        type: Sequelize.STRING
      },
      unique: { // unique_id for page
        type: Sequelize.STRING
      },
      display: { // display name
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      status: { // 0:disable 1:enable 2:view only(convert lr2)
        type: Sequelize.INTEGER
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};