const Sequelize = require('sequelize')

const Model = Sequelize.Model;

class Users extends Model{}
// const {Post} = require('../config/Post')

Users.init (
    {
        id:	{type: Sequelize.INTEGER, primaryKey:true, unique: true, autoIncrementIdentity: true, required: true},
        username:{type: Sequelize.STRING,  allowNull: false, unique: true, required: true},    
        email: {type: Sequelize.STRING, allowNull: false, unique: true, required: true},
        password_hash: {type: Sequelize.STRING, allowNull: false, required: true},
        points: {type: Sequelize.INTEGER},
        role: {type: Sequelize.STRING,  validate: {isIn:[['user', 'admin']]} },
        is_activated:{type: Sequelize.BOOLEAN, default: false},
        activation_link: {type: Sequelize.STRING}
    },
    { sequelize, modelName:'Users', tableName:'users', timestamps: false}
);

module.exports = {Users};