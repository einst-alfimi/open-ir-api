'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Course.init({
    name: DataTypes.STRING,
    sha256: DataTypes.STRING, // course hash. 
    song1sha256: DataTypes.STRING,
    song2sha256: DataTypes.STRING,
    song3sha256: DataTypes.STRING,
    song4sha256: DataTypes.STRING,
    song5sha256: DataTypes.STRING,
    type: DataTypes.STRING, // CLASS
    gauge: DataTypes.STRING, // GAUGE_LR2 ...
    speed: DataTypes.STRING, // NO_SPEED
    judge: DataTypes.STRING, // NO_GOOD ...
    ln: DataTypes.STRING, // LN, CN, HCN...
    status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};