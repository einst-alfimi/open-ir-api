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
        type: Sequelize.STRING
      },
      user_id: {
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
        type: Sequelize.INTEGER
      },
      lntype: {
        // 0=LN 1=CN 2=HCN
        type: Sequelize.INTEGER
      },
      epg: {
        type: Sequelize.INTEGER
      },
      lpg: {
        type: Sequelize.INTEGER
      },
      egr: {
        type: Sequelize.INTEGER
      },
      lgr: {
        type: Sequelize.INTEGER
      },
      egd: {
        type: Sequelize.INTEGER
      },
      lgd: {
        type: Sequelize.INTEGER
      },
      ebd: {
        type: Sequelize.INTEGER
      },
      lbd: {
        type: Sequelize.INTEGER
      },
      epr: {
        type: Sequelize.INTEGER
      },
      lpr: {
        type: Sequelize.INTEGER
      },
      ems: {
        type: Sequelize.INTEGER
      },
      lms: {
        type: Sequelize.INTEGER
      },
      maxcombo: {
        type: Sequelize.INTEGER
      },
      notes: {
        type: Sequelize.INTEGER
      },
      passnotes: {
        type: Sequelize.INTEGER
      },
      minbp: {
        type: Sequelize.INTEGER
      },
      option: {
        type: Sequelize.INTEGER
      },
      assist: {
        type: Sequelize.INTEGER
      },
      gauge: {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
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