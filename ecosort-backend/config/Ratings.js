const Sequelize = require('sequelize')

const Model = Sequelize.Model;

class Ratings extends Model{}

const {Users} = require('../config/Users')
const {Articles} = require('../config/Articles')

Ratings.init (
    {
        id:	{type: Sequelize.INTEGER, primaryKey:true, unique: true, autoIncrementIdentity: true, required: true},
        article_id: {type: Sequelize.INTEGER, allowNull: false, required: true},
        commentator: {type: Sequelize.INTEGER, allowNull: false, required: true},
        comment: {type: Sequelize.STRING, required: true},
        date_of_add: {type: Sequelize.DATE, allowNull: false, required: true}
    },
    { sequelize, modelName: 'Ratings', tableName: 'ratings', timestamps: false }
);

Users.hasMany(Ratings, {foreignKey: 'commentator'});
Ratings.belongsTo(Users, {foreignKey: 'commentator'});
Articles.hasMany(Ratings, {foreignKey: 'article_id', onDelete: 'cascade'});
Ratings.belongsTo(Articles, {foreignKey: 'article_id'});

module.exports = {Ratings};