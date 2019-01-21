const Sequelize = require("sequelize")
const db = require("../config/db")

module.exports = db.sequelize.define(
    'prescription',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        doctor_id: {
            type: Sequelize.INTEGER         ,
        },
        exo_id  : {
            type: Sequelize.INTEGER,
        },
        exo_name: {
            type: Sequelize.STRING,
        },
        user_id: {
            type: Sequelize.INTEGER,
        },
        level: {
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