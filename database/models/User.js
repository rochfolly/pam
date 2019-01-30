const Sequelize = require("sequelize")
const db = require("../config/db")

module.exports = db.sequelize.define(
    'user',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        doctor_id: {
            type: Sequelize.INTEGER         ,
        },
        firstname: {
            type: Sequelize.STRING,
        },
        name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        gender : {
            type: Sequelize.CHAR,
        },
        birth: {
            type: Sequelize.DATE,
        },
        city: {
            type: Sequelize.STRING,
        },
        is_doctor: {
            type: Sequelize.INTEGER,
        },
        created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    }
)