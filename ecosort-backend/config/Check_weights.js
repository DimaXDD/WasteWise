const Sequelize = require('sequelize')

const Model = Sequelize.Model;

class Check_weights extends Model{}

const {Marks} = require('../config/Marks')


Check_weights.init(
    {
        id: {type: Sequelize.INTEGER, primaryKey:true, unique: true, autoIncrementIdentity: true, required: true},
        rubbish_id: {type: Sequelize.INTEGER, allowNull: false, required: true},
        weight: {type: Sequelize.INTEGER, allowNull: false, required: true},
        key_of_weight: {type: Sequelize.STRING, allowNull: false, required: true},
        is_used: { // Столбец для отслеживания одноразового использования ключа
            type: Sequelize.INTEGER,
            defaultValue: 0,  // по умолчанию 0, т.е. не использован
            validate: {
                isIn: [[0, 1]]  // значения могут быть только 0 или 1
            },
            required: true
        }
    },
    {sequelize, modelName: 'Check_weights', tableName: 'check_weight', timestamps: false}
);

Marks.hasMany(Check_weights, {foreignKey:'rubbish_id'});
Check_weights.belongsTo(Marks, {foreignKey: 'rubbish_id'});

module.exports = {Check_weights};