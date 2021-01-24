require('dotenv').config();

module.exports = {
  'development': {
    'username': process.env.MYSQL_USER,
    'password': process.env.MYSQL_PASSWORD,
    'database': process.env.MYSQL_DATABASE,
    'host': process.env.MYSQL_HOST,
    'port': '3306',
    'dialect': 'mysql',
  },
  'production': {
    'username': process.env.MYSQL_USER,
    'password': process.env.MYSQL_PASSWORD,
    'database': process.env.MYSQL_DATABASE,
    'host': process.env.MYSQL_HOST,
    'port': '3306',
    'dialect': 'mysql',
  },
};