const { Sequelize } = require('sequelize');

const isDocker = process.env.DOCKER_ENV === 'true';

const dbConfig = {
  database: 'ecosort',
  username: 'root',
  password: '1111',
  host: isDocker ? 'host.docker.internal' : 'localhost',
  dialect: 'mysql',
};

// Инициализация Sequelize
global.sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
});

// Импорт моделей
const { Articles } = require('./Articles');
const { Discounts } = require('./Discounts');
const { Marks } = require('./Marks');
const { Points } = require('./Points');
const { Ratings } = require('./Ratings');
const { Receptions } = require('./Receptions');
const { Users } = require('./Users');
const { Keys } = require('./Keys');
const { Check_weights } = require('./Check_weights');
const { Likes } = require('./Likes');
const { Points_marks } = require('./Points_marks');
const { Promo_codes } = require('./Promo_codes');

// Экспорт моделей
module.exports = {
  models: {
    Articles,
    Discounts,
    Marks,
    Points,
    Ratings,
    Receptions,
    Users,
    Keys,
    Check_weights,
    Likes,
    Points_marks,
    Promo_codes,
  },
};