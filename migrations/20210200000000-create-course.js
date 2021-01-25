'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: { 
        type: Sequelize.STRING
      },
      sha256: { 
        type: Sequelize.STRING
      },
      song1sha256: { 
        type: Sequelize.STRING
      },
      song2sha256: { 
        type: Sequelize.STRING
      },
      song3sha256: { 
        type: Sequelize.STRING
      },
      song4sha256: { 
        type: Sequelize.STRING
      },
      song5sha256: { 
        type: Sequelize.STRING
      },
      type: { // CLASS, EXPERT etc...
        // TODO Defaultはいるのか
        type: Sequelize.STRING
      },
      gauge: { // gauge type
        type: Sequelize.STRING
      },
      speed: { 
        type: Sequelize.STRING
      },
      judge: { 
        type: Sequelize.STRING
      },
      ln: { 
        type: Sequelize.STRING
      },
      status: { // 0:disable 1:enable 
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Courses');
  }
};