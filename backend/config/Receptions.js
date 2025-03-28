const Sequelize = require('sequelize')

const Model = Sequelize.Model;

class Receptions extends Model{}

const {Users} = require('./Users')
const {Marks} =require('./Marks')
const {Keys} = require('./Keys')
const {Check_weights} = require('./Check_weights')

Receptions.init (
    {
            id:	{type: Sequelize.INTEGER, primaryKey:true, unique: true, autoIncrementIdentity: true, required: true},
            user_id: {type: Sequelize.INTEGER, allowNull: false, required: true},
            accrued: {type: Sequelize.INTEGER, required: true},
            new_kg: {type: Sequelize.INTEGER, required: true},
            weight: {type: Sequelize.FLOAT, allowNull: false, required: true},
            type_waste: {type: Sequelize.INTEGER, allowNull: false, required: true},
            station_key: {type: Sequelize.INTEGER, allowNull: false, required: true},
            weight_key: {type: Sequelize.INTEGER, allowNull: false, required: true},
    },
    { sequelize, modelName: 'Receptions', tableName: 'receptions', timestamps: false }
);


Users.hasMany(Receptions, {foreignKey: 'user_id'});
Receptions.belongsTo(Users, {foreignKey: 'user_id'});

Marks.hasMany(Receptions, {foreignKey: 'type_waste'});
Receptions.belongsTo(Marks, {foreignKey: 'type_waste'});

Keys.hasMany(Receptions, {foreignKey: 'station_key'});
Receptions.belongsTo(Keys, {foreignKey: 'station_key'});

Check_weights.hasMany(Receptions, {foreignKey: 'weight_key'});
Receptions.belongsTo(Check_weights, {foreignKey: 'weight_key'});

module.exports = {Receptions};