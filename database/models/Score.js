const Sequelize = require("sequelize")
const db = require("../config/db")

module.exports = db.sequelize.define(
    'score',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        exo_id  : {
            type: Sequelize.INTEGER,
        },
        user_id: {
            type: Sequelize.INTEGER,
        },
        value: {
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