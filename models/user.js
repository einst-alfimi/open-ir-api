'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User.belongsTo(models.Rival, {foreignKey: 'id', targetKey: "user_id"});
      // User.belongsTo(models.Rival, {foreignKey: 'id', targetKey: "rival_id"});
    }
  };
  User.init({
    name: DataTypes.STRING,
    unique: DataTypes.STRING,
    display: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};