const Sequelize = require("sequelize")
const db = require("../config/db")

module.exports = db.sequelize.define(
    'doctor',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        job: {
            type: Sequelize.STRING,
        },
        city: {
            type: Sequelize.STRING,
        },
        phone: {
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