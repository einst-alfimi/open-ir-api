'use strict';
const bcrypt = require('bcrypt');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const myPlaintextPassword = 'test-password';
    const saltRounds = 10;
    const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
    // TODO uniqueIDの生成方法は考える
    return queryInterface.bulkInsert('Users', [
      { name: 'test-user',  display: 'テストユーザ1', password: hash,status: 1, createdAt: now, updatedAt: now},
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});  }
};
