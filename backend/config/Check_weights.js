const Sequelize = require('sequelize')

const Model = Sequelize.Model;

class Check_weights extends Model{}

const {Marks} = require('../config/Marks')


Check_weights.init(
    {
        id: { type: Sequelize.INTEGER, primaryKey: true, unique: true, autoIncrement: true, required: true },
        rubbish_id: { type: Sequelize.INTEGER, allowNull: false, required: true },
        weight: { type: Sequelize.INTEGER, allowNull: false, required: true },
        key_of_weight: { type: Sequelize.STRING, allowNull: false, required: true },
        original_key: { type: Sequelize.STRING, allowNull: false }, // Новое поле для оригинального ключа
        is_used: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    },
    { sequelize, modelName: 'Check_weights', tableName: 'check_weight', timestamps: false }
);


Marks.hasMany(Check_weights, {foreignKey:'rubbish_id'});
Check_weights.belongsTo(Marks, {foreignKey: 'rubbish_id'});

module.exports = {Check_weights};