const Sequelize = require('sequelize')

const Model = Sequelize.Model;

class Discounts extends Model{}

Discounts.init (
    {
        id:	{type: Sequelize.INTEGER, primaryKey:true, unique: true, autoIncrementIdentity: true, required: true},
        discount: {type: Sequelize.STRING, allowNull: false, unique: true, required: true},
        count_for_dnt: {type: Sequelize.INTEGER, allowNull: false, required: true},
        promo_code: {type: Sequelize.STRING, allowNull: false, unique: true, required: true},
    },
    { sequelize, modelName: 'Discounts', tableName: 'discounts', timestamps: false }
);

module.exports = {Discounts};