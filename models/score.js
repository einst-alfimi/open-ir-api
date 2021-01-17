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
      // define association here
    }
  };
  Score.init({
    sha256: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    clear: DataTypes.STRING,
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
    option: DataTypes.INTEGER,
    deviceType: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Score',
  });
  return Score;
};