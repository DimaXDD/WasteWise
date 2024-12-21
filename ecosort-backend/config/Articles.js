const Sequelize = require('sequelize')

const Model = Sequelize.Model;

class Articles extends Model { }
const { Users } = require('../config/Users')
Articles.init(
    {
            id: { type: Sequelize.INTEGER, primaryKey: true, unique: true, autoIncrementIdentity: true, required: true },
            title: { type: Sequelize.STRING, allowNull: false, unique: true, required: true },
            text: { type: Sequelize.TEXT, allowNull: false, required: true },
            date_of_pub: { type: Sequelize.DATE, allowNull: false, required: true },
            image_url: { type: Sequelize.STRING },
            author: { type: Sequelize.INTEGER, allowNull: false, required: true },
            likes: { type: Sequelize.INTEGER, required: true },
    },
    { sequelize, modelName: 'Articles', tableName: 'articles', timestamps: false }
);
Users.hasMany(Articles, { foreignKey: 'author' });
Articles.belongsTo(Users, { foreignKey: 'author' });
module.exports = { Articles };