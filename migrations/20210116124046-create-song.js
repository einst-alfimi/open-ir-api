'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Songs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      subtitle: {
        type: Sequelize.STRING
      },
      genre: {
        type: Sequelize.STRING
      },
      artist: {
        type: Sequelize.STRING
      },
      subartist: {
        type: Sequelize.STRING
      },
      md5: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      sha256: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      mode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.INTEGER
      },
      lntype: {
        // 0=LN 1=CN 2=HCN
        type: Sequelize.INTEGER
      },
      judge: {
        type: Sequelize.INTEGER
      },
      notes: {
        type: Sequelize.INTEGER
      },
      total: {
        type: Sequelize.INTEGER
      },
      minbpm: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      maxbpm: {
        allowNull: false,
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
    await queryInterface.dropTable('Songs');
  }
};