const Sequelize = require('sequelize')

const Model = Sequelize.Model;

class Marks extends Model{}

Marks.init (
    {
        id:	{type: Sequelize.INTEGER, primaryKey:true, unique: true, autoIncrementIdentity: true, required: true},
        rubbish: {type: Sequelize.STRING, allowNull: false, required: true},
        points_per_kg: {type: Sequelize.INTEGER, allowNull: false, required: true},
        new_from_kg: {type: Sequelize.FLOAT, allowNull: false, required: true},
        image_link: { type: Sequelize.STRING },
    },
    { sequelize, modelName: 'Marks', tableName: 'marks', timestamps: false }
);

module.exports = {Marks};