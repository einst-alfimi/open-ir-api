'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Scores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sha256: {
        allowNull: false,
        type: Sequelize.STRING
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      clear: {
        // NoPlay 0
        // Failed 1
        // AssistEasy 2
        // LightAssistEasy 3
        // Easy 4
        // Normal 5
        // Hard 6
        // ExHard 7
        // FullCombo 8
        // Perfect 9
        // Max 10
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      lntype: {
        // 0=LN 1=CN 2=HCN
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      epg: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      lpg: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      egr: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      lgr: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      egd: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      lgd: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      ebd: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      lbd: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      epr: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      lpr: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      ems: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      lms: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      maxcombo: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      notes: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      passnotes: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      minbp: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      option: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      assist: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      gauge: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      deviceType: {
        type: Sequelize.STRING
      },
      judgeAlgorithm: {
        type: Sequelize.STRING
      },
      rule: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      scoretype: { // song=0, course=1
        allowNull: false,
        defaultValue: 0,
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
    }, {
      // lntype別にスコア保存する
      uniqueKeys: {
          ScoresIndex: {
              fields: ['user_id', 'sha256', 'lntype']
          }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Scores');
  }
};