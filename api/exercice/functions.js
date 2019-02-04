const Doctor = require('../../database/models/Doctor')
const Prescription = require('../../database/models/Prescription')
const db = require("../../database/config/db")
const sequelize = require("sequelize")
const moment = require('moment')

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


function getStats(req, res){
  //Exercices prescrits
  db.sequelize.query("SELECT p.exo_name, p.exo_id, p.level, p.user_id FROM prescription p, user u WHERE u.id = p.user_id AND p.user_id = ? ORDER BY p.exo_id",
  { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT })
  .then(rows => {
      var ResponseTab = new Array(rows.length)
      rows.forEach((exo, index) => {
          console.log(index)
          ResponseTab[index] = {id:'', title:'', plays:'', bestScore:'', lastScore:'', lastPlay:'', dates:[], values:[]}
          //Titres
          ResponseTab[index].title = exo.exo_name
          ResponseTab[index].id = exo.exo_id


          //Nombre de parties jouées
          db.sequelize.query("SELECT COUNT(id) AS played FROM score WHERE exo_id = ? AND user_id = ?",
          { replacements: [exo.exo_id, req.params.id], type: sequelize.QueryTypes.SELECT })
          .then(count => {
              ResponseTab[index].plays = count[0].played

              //Meilleur score
              db.sequelize.query("SELECT MAX(value) AS maxscore FROM score WHERE exo_id = ? AND user_id = ?",
              { replacements: [exo.exo_id, req.params.id], type: sequelize.QueryTypes.SELECT })
              .then(max => {
                  if(index == 0){console.log(max[0].maxscore)}
                  ResponseTab[index].bestScore = max[0].maxscore
                  
                  //Dernière partie
                  db.sequelize.query("SELECT created, value FROM score WHERE exo_id = ? AND user_id = ? ORDER BY created DESC LIMIT 1",
                  { replacements: [exo.exo_id, req.params.id], type: sequelize.QueryTypes.SELECT })
                  .then(row => {
                    ResponseTab[index].lastScore = row[0].value
                    ResponseTab[index].lastPlay = moment(row[0].created).format('LLL') 
 
                      //Dates (graph)
                      db.sequelize.query("SELECT created FROM score WHERE exo_id = ? AND user_id = ? ORDER BY created ASC LIMIT 10",
                      { replacements: [exo.exo_id, req.params.id], type: sequelize.QueryTypes.SELECT })
                      .then(plays => {
                          const proper = []
                          plays.forEach((play, index) => {
                            proper[index] = moment(play.created).format('L')
                          })
                          ResponseTab[index].dates = proper
                          console.log(plays)

                          //Valeurs (graph)
                          db.sequelize.query("SELECT value FROM score WHERE exo_id = ? AND user_id = ? ORDER BY created ASC LIMIT 10",
                          { replacements: [exo.exo_id, req.params.id], type: sequelize.QueryTypes.SELECT })
                          .then(scores => {
                            const palmares = []
                            scores.forEach((score, index) => {
                             palmares[index] = score.value
                            })
                            ResponseTab[index].values = palmares
                            if(index == rows.length-1)
                            {
                              console.log(ResponseTab)
                              res.send(ResponseTab)
                            }
                          })
                      })

                  })

              })

          })        

       })
       
      
  })

}

function getSingleStats(req, res){
  //Exercices prescrits
  db.sequelize.query("SELECT p.exo_name, p.exo_id, p.level, p.user_id FROM prescription p, user u WHERE u.id = p.user_id AND p.user_id = ? AND p.exo_id = ?",
  { replacements: [req.params.id, req.params.exo_id], type: sequelize.QueryTypes.SELECT })
  .then(row => {
      var ResponseTab = [{id:'', title:'', plays:'', bestScore:'', lastScore:'', lastPlay:'', dates:[], values:[]}]
          
          //Titres
          ResponseTab[0].title = row[0].exo_name
          ResponseTab[0].id = row[0].exo_id


          //Nombre de parties jouées
          db.sequelize.query("SELECT COUNT(id) AS played FROM score WHERE exo_id = ? AND user_id = ?",
          { replacements: [row[0].exo_id, req.params.id], type: sequelize.QueryTypes.SELECT })
          .then(count => {
              ResponseTab[0].plays = count[0].played

              //Meilleur score
              db.sequelize.query("SELECT MAX(value) AS maxscore FROM score WHERE exo_id = ? AND user_id = ?",
              { replacements: [row[0].exo_id, req.params.id], type: sequelize.QueryTypes.SELECT })
              .then(max => {
                  ResponseTab[0].bestScore = max[0].maxscore
                  
                  //Dernière partie
                  db.sequelize.query("SELECT created, value FROM score WHERE exo_id = ? AND user_id = ? ORDER BY created DESC LIMIT 1",
                  { replacements: [row[0].exo_id, req.params.id], type: sequelize.QueryTypes.SELECT })
                  .then(last => {
                    ResponseTab[0].lastScore = last[0].value
                    ResponseTab[0].lastPlay = moment(last[0].created).format('LLL') 
 
                      //Dates (graph)
                      db.sequelize.query("SELECT created FROM score WHERE exo_id = ? AND user_id = ? ORDER BY created ASC LIMIT 10",
                      { replacements: [row[0].exo_id, req.params.id], type: sequelize.QueryTypes.SELECT })
                      .then(plays => {
                          const proper = []
                          plays.forEach((play, index) => {
                            proper[index] = moment(play.created).format('L')
                          })
                          ResponseTab[0].dates = proper
                          console.log(plays)

                          //Valeurs (graph)
                          db.sequelize.query("SELECT value FROM score WHERE exo_id = ? AND user_id = ? ORDER BY created ASC LIMIT 10",
                          { replacements: [row[0].exo_id, req.params.id], type: sequelize.QueryTypes.SELECT })
                          .then(scores => {
                            const palmares = []
                            scores.forEach((score, index) => {
                             palmares[index] = score.value
                            })
                            ResponseTab[0].values = palmares
                              console.log(ResponseTab)
                              res.send(ResponseTab)
                            
                          })
                      })

                  })

              })

          })        
       
      
  })

}

function getGlobal(req, res) {
  db.sequelize.query("SELECT p.exo_name, p.exo_id, p.level, p.user_id FROM prescription p, user u WHERE u.id = p.user_id AND p.user_id = ? ORDER BY p.exo_id",
  { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT })
  .then(rows => {
      var ResponseTab = [{exo_id:[]}, {titles:[]}, {bestscores:[]}, {oldscores:[]}]
      const date = new Date()
      const current = date.getMonth() +1
      console.log(current)
      const ancient = (current == 1) ? 12 : current - 1  
      rows.forEach((exo, index) => {
        ResponseTab[1].titles[index] = exo.exo_name
        ResponseTab[0].exo_id[index] = exo.exo_id
        db.sequelize.query("SELECT MAX(value) AS maxscore FROM score WHERE exo_id = ? AND user_id = ? AND month(created) = ?",
              { replacements: [exo.exo_id, req.params.id, current], type: sequelize.QueryTypes.SELECT })
              .then(row => {
                console.log(row)
                ResponseTab[2].bestscores[index] = row[0].maxscore
                  db.sequelize.query("SELECT MAX(value) AS maxscore FROM score WHERE exo_id = ? AND user_id = ? AND month(created) = ?",
                  { replacements: [exo.exo_id, req.params.id, ancient], type: sequelize.QueryTypes.SELECT })
                  .then(rowa => { 
                    ResponseTab[3].oldscores[index] = rowa[0].maxscore
                    if(index == rows.length - 1){res.send(ResponseTab)}
                  })
                
              })
      })
  })
  
}

function fillJauge(req, res){
  db.sequelize.query("SELECT SUM(value) AS total FROM score WHERE user_id = ?",
  { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT })
  .then(rows => {
    console.log(rows)
    res.send(rows[0].total)
  })
}


exports.updatePrescription = updatePrescription;
exports.getSingleStats = getSingleStats;
exports.fetchOther = fetchOther;
exports.getGlobal = getGlobal;
exports.fillJauge = fillJauge;
exports.getStats = getStats;
exports.fetch = fetch;

/*
var ResponseTab = new Array (2)
  ResponseTab[0] = {label:'coucou', titles:[], bestscores:[]}
  ResponseTab[1] = {label:'coucou', titles:[], bestscores:[]}


  //Exercices prescrits
  db.sequelize.query("SELECT p.exo_name, p.exo_id, p.level, p.user_id FROM prescription p, user u WHERE u.id = p.user_id AND p.user_id = ? ORDER BY p.exo_id",
  { replacements: [req.params.id], type: sequelize.QueryTypes.SELECT })
  .then(rows => {
    rows.forEach((exo, index) => {
        ResponseTab[0].titles[index] = exo.exo_name
        ResponseTab[1].titles[index] = exo.exo_name
        db.sequelize.query("SELECT MAX(value) AS maxscore FROM score WHERE exo_id = ? AND user_id = ?",
        { replacements: [exo.exo_id, req.params.id], type: sequelize.QueryTypes.SELECT })
        .then(row => {
          console.log(row)
           ResponseTab[0].bestscores[index] = row[0].maxscore
           ResponseTab[1].bestscores[index] = row[0].maxscore
          if(index == rows.length-1){ res.send(ResponseTab)}
        })
    })
      })*/