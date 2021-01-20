'use strict';
const bcrypt = require('bcrypt');
const strUtil = require('../util/str');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const myPlaintextPassword = 'test-password';
    const saltRounds = 10;
    const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
    const unique_id = strUtil.makeUniqueId();
    // TODO uniqueIDの生成方法は考える
    return queryInterface.bulkInsert('Users', [
      { name: 'test-user', unique: unique_id, display: 'テストユーザ1', password: hash,status: 1, createdAt: now, updatedAt: now},
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});  }
};
