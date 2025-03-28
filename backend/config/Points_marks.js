const Sequelize = require('sequelize')

const Model = Sequelize.Model;

class Points_marks extends Model{}
const {Marks} = require('../config/Marks')
const {Points} = require('../config/Points')

Points_marks.init(
    {
        id: {type: Sequelize.INTEGER, primaryKey:true, unique: true, autoIncrementIdentity: true, required: true},
        points_id: {type: Sequelize.INTEGER, allowNull: false, required: true},
        marks_id: {type: Sequelize.INTEGER, allowNull: false, required: true},
    },
    {sequelize, modelName: 'Points_marks', tableName: 'points_marks', timestamps: false}
);

Points.hasMany(Points_marks, {foreignKey:'points_id'});
Points_marks.belongsTo(Points, {foreignKey: 'points_id'});

Marks.hasMany(Points_marks, {foreignKey:'marks_id'});
Points_marks.belongsTo(Marks, {foreignKey: 'marks_id'});

module.exports = {Points_marks};