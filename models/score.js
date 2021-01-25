'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Score.belongsTo(models.User, {foreignKey: 'user_id', targetKey: "id"});
    }
  };
  Score.init({
    sha256: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    clear: DataTypes.INTEGER,
    lntype: DataTypes.INTEGER,
    epg: DataTypes.INTEGER,
    lpg: DataTypes.INTEGER,
    egr: DataTypes.INTEGER,
    lgr: DataTypes.INTEGER,
    egd: DataTypes.INTEGER,
    lgd: DataTypes.INTEGER,
    ebd: DataTypes.INTEGER,
    lbd: DataTypes.INTEGER,
    epr: DataTypes.INTEGER,
    lpr: DataTypes.INTEGER,
    ems: DataTypes.INTEGER,
    maxcombo: DataTypes.INTEGER,
    notes: DataTypes.INTEGER,
    passnotes: DataTypes.INTEGER,
    minbp: DataTypes.INTEGER,
    option: DataTypes.INTEGER,
    assist: DataTypes.INTEGER,
    gauge: DataTypes.INTEGER,
    deviceType: DataTypes.INTEGER,
    judgeAlgorithm: DataTypes.STRING,
    rule: DataTypes.STRING,
    type: DataTypes.STRING,
    scoretype: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Score',
  });
  return Score;
};