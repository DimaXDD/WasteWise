const Sequelize = require('sequelize')

const Model = Sequelize.Model;

class Points extends Model{}
const {Users} = require('../config/Users')
const {Keys} = require('./Keys')
const {Marks} = require('./Marks')

Points.init (
    {
            id:	{type: Sequelize.INTEGER, primaryKey:true, unique: true, autoIncrement: true, required: true},
            address: {type: Sequelize.STRING, allowNull: false, unique: true, required: true},
            point_name: {type: Sequelize.STRING, allowNull: false, unique: true, required: true},
            time_of_work: {type: Sequelize.STRING, allowNull: false, required: true},
            key_id: {type: Sequelize.INTEGER, allowNull: false, unique: true, required: true},
            admin_id: {type: Sequelize.INTEGER, allowNull: true, required: true },
            link_to_map: {type: Sequelize.TEXT, required:true},
    },
    {sequelize, modelName: 'Points', tableName: 'points', timestamps: false}
);

Users.hasMany(Points, {foreignKey:'admin_id'});
Points.belongsTo(Users, {foreignKey: 'admin_id'});
Keys.hasMany(Points, {foreignKey:'key_id'});
Points.belongsTo(Keys, {foreignKey: 'key_id'});

// Связь many-to-many между Points и Marks
Points.belongsToMany(Marks, { 
    through: 'Points_marks', 
    foreignKey: 'points_id',
    otherKey: 'marks_id'
});
Marks.belongsToMany(Points, { 
    through: 'Points_marks', 
    foreignKey: 'marks_id',
    otherKey: 'points_id'
});

module.exports = {Points};