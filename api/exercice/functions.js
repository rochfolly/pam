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

/*<Row>Titre</Row>
<Row>Parties jouées : X</Row>
<Row>Meilleur score : X</Row>
<Row>Dernière partie : 00/00/0000</Row>
<Row>Score : X/X</Row> */

function getStats(req, res){
  //Exercices prescrits
  db.sequelize.query("SELECT p.exo_name, p.exo_id, p.level, p.user_id FROM prescription p, user u WHERE u.id = p.user_id AND p.user_id = ? ORDER BY p.exo_id",
  { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT })
  .then(rows => {
      console.log(rows)
      var ResponseTab = new Array(rows.length)
      console.log(rows.length)
      rows.forEach((exo, index) => {
          console.log(index)
          //Titres
          ResponseTab[index] = exo.exo_name

          //Nombre de parties jouées
          db.sequelize.query("SELECT COUNT(id) FROM score WHERE exo_id = ? AND user_id = ?",
          { replacements: [exo.id, req.params.id], type: sequelize.QueryTypes.SELECT })
          .then(count => ResponseTab[index].plays = count)

          //Meilleur score
          db.sequelize.query("SELECT MAX(value) FROM score WHERE exo_id = ? AND user_id = ?",
          { replacements: [exo.id, req.params.id], type: sequelize.QueryTypes.SELECT })
          .then(max => ResponseTab[index].bestScore = max)

          //Dernière partie
          db.sequelize.query("SELECT created, value FROM score WHERE exo_id = ? AND user_id = ? ORDER BY created DESC LIMIT 1",
          { replacements: [exo.id, req.params.id], type: sequelize.QueryTypes.SELECT })
          .then(row => {
            ResponseTab[index].lastScore = row.value
            ResponseTab[index].lastPlay = row.created 
          })

          //Dates (graph)
          db.sequelize.query("SELECT created FROM score WHERE exo_id = ? AND user_id = ? ORDER BY created ASC LIMIT 10",
          { replacements: [exo.id, req.params.id], type: sequelize.QueryTypes.SELECT })
          .then(rows => {
            ResponseTab[index].dates = rows
          })

          //Valeurs (graph)
          db.sequelize.query("SELECT value FROM score WHERE exo_id = ? AND user_id = ? ORDER BY created ASC LIMIT 10",
          { replacements: [exo.id, req.params.id], type: sequelize.QueryTypes.SELECT })
          .then(rows => {
            ResponseTab[index].dates = rows
          })
       })
      console.log(ResponseTab)
      res.send(ResponseTab)
  })


}


exports.updatePrescription = updatePrescription;
exports.fetchOther = fetchOther;
exports.getStats = getStats;
exports.fetch = fetch;