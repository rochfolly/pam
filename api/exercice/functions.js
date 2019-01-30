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

function fetchOther (req, res) {
  db.sequelize.query("SELECT * FROM exercice WHERE exo_id NOT IN (SELECT exo_id FROM prescription WHERE user_id = ?)",
  { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT })
  .then(rows => {
      console.log(rows)
      res.send(rows)
  })
  .catch(err => {
    res.status(400).json({ error: err })
  })
}

function updatePrescription (req, res) {
  Prescription.findOne({
    where: {
      user_id : req.params.user_id,
      exo_id : req.params.exo_id
    }
  }).then(pres => {
      if(pres){
         res.end()
      }
      else{
        db.sequelize.query("SELECT exo_name FROM exercice WHERE exo_id = ?",
        { replacements: [req.params.exo_id], type: sequelize.QueryTypes.SELECT })
        .then(name => {
          const new_pres = {
          exo_id: req.params.exo_id,
          user_id: req.params.user_id,
          exo_name: name,
          level: 1
        }
        Prescription.create(new_pres)
        })
    }
  })
}


exports.updatePrescription = updatePrescription;
exports.fetchOther = fetchOther;
exports.fetch = fetch;