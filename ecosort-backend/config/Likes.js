const Sequelize = require('sequelize')

const Model = Sequelize.Model;

class Likes extends Model{}

const {Users} = require('../config/Users')
const {Articles} = require('../config/Articles')

Likes.init (
    {
        id:	{type: Sequelize.INTEGER, primaryKey:true, unique: true, autoIncrementIdentity: true, required: true},
        article_id: {type: Sequelize.INTEGER, allowNull: false, required: true},
        user_id: {type: Sequelize.INTEGER, allowNull: false, required: true},
    },
    { sequelize, modelName: 'Likes', tableName: 'likes', timestamps: false }
);

Users.hasMany(Likes, {foreignKey: 'user_id'});
Likes.belongsTo(Users, {foreignKey: 'user_id'});
Articles.hasMany(Likes, {foreignKey: 'article_id'});
Likes.belongsTo(Articles, {foreignKey: 'article_id'});

module.exports = {Likes};