const Sequelize = require('sequelize')

const Model = Sequelize.Model;

class Promo_codes extends Model{}

const {Users} = require('../config/Users')
const {Discounts} = require('../config/Discounts')

Promo_codes.init(
    {
        id:	{type: Sequelize.INTEGER, primaryKey:true, unique: true, autoIncrementIdentity: true, required: true},
        promo_code: {type: Sequelize.STRING, allowNull: false, required: true},
        user_id: {type: Sequelize.INTEGER, allowNull: false,  required: true},
        discount_id: {type: Sequelize.INTEGER, allowNull: false,  required: true},
        date_of_add: {type: Sequelize.DATE, allowNull: false, required: true}
    },
    { sequelize, modelName: 'Promo_codes', tableName: 'promo_codes', timestamps: false }
);

Users.hasMany(Promo_codes, { foreignKey: 'user_id' });
Promo_codes.belongsTo(Users, { foreignKey: 'user_id' });
Discounts.hasMany(Promo_codes, { foreignKey: 'discount_id' });
Promo_codes.belongsTo(Discounts, { foreignKey: 'discount_id' });

module.exports = {Promo_codes};