'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // TODO model定義なのでclearDataType とかあると嬉しい
    static associate(models) {
      // define association here
    }
  };
  Song.init({
    title: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    genre: DataTypes.STRING,
    artist: DataTypes.STRING,
    subartist: DataTypes.STRING,
    md5: DataTypes.STRING,
    sha256: DataTypes.STRING,
    mode: DataTypes.STRING,
    level: DataTypes.INTEGER,
    lntype: DataTypes.INTEGER,
    judge: DataTypes.INTEGER,
    notes: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    minbpm: DataTypes.INTEGER,
    maxbpm: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Song',
  });
  return Song;
};