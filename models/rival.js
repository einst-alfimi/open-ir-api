'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rival extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rival.belongsTo(models.User, {foreignKey: 'rival_id', targetKey: "id"});
      // Rival.belongsTo(models.User, {foreignKey: 'user_id', targetKey: "id"});
    }
  };
  Rival.init({
    rival_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Rival',
  });
  return Rival;
};