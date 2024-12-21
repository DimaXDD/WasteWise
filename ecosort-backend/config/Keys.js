const Sequelize = require('sequelize')

const Model = Sequelize.Model;

class Keys extends Model{}

Keys.init({
        id:	{type: Sequelize.INTEGER, primaryKey:true, unique: true, autoIncrementIdentity: true, required: true},
        secret_key: {type: Sequelize.STRING, allowNull: false, unique: true, required: true},
        is_used: {type: Sequelize.INTEGER, allowNull: false, defaultValue:0 } ,
    },
    {sequelize, modelName: 'Keys', tableName: 's_keys', timestamps: false}
);

module.exports = {Keys};