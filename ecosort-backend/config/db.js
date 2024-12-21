const sequelize = require('sequelize');

global.sequelize = new sequelize(
    'ecosort', 
    'root', 
    '1111', 
    {host:'localhost', dialect:'mysql'})

// докер
// global.sequelize = new sequelize(
// 'ecosort', 
// 'root', '1111', 
// {host:'host.docker.internal', dialect:'mysql'})

const {Articles} = require('./Articles')
const {Discounts} = require('./Discounts')
const {Marks} = require('./Marks')
const {Points} = require('./Points')
const {Ratings} = require('./Ratings')
const {Receptions} = require('./Receptions')
const {Users} = require('./Users')
const {Keys} = require('./Keys')
const {Check_weights} = require('./Check_weights')
const {Likes} = require('./Likes')
const {Points_marks} = require('./Points_marks')
const {Promo_codes} = require('./Promo_codes')

module.exports = {
    models: {Articles, Discounts, Marks, Points, Ratings, Receptions, Users, Keys, Check_weights, Likes, Points_marks, Promo_codes}
}