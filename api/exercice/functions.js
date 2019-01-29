const Doctor = require('../../database/models/Doctor')
const Prescription = require('../../database/models/Prescription')
const db = require("../../database/config/db")
const sequelize = require("sequelize")

//SELECT * FROM user, prescription WHERE user.id = prescription.user_id
function fetch (req, res) {
  db.sequelize.query("SELECT p.exo_name, p.exo_id, p.level, p.user_id FROM prescription p, user u WHERE u.id = p.user_id AND p.user_id = ? ORDER BY p.exo_id",
  { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT })
  .then(rows => {
      console.log(rows)
      res.send(rows)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })
}

exports.fetch = fetch;