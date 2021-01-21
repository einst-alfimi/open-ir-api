'use strict';
const bcrypt = require('bcrypt');
const strUtil = require('../util/str');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const myPlaintextPassword = 'test-password';
    const saltRounds = 10;
    const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
    return queryInterface.bulkInsert('Users', [
      { name: 'test-user', unique: strUtil.makeUniqueId(), display: 'テストユーザ1', password: hash,status: 1, createdAt: now, updatedAt: now},
      { name: 'test-user2', unique: strUtil.makeUniqueId(), display: 'テストユーザ2', password: hash,status: 1, createdAt: now, updatedAt: now},
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});  }
};
