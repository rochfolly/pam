//Express
const express = require('express');
const app = express()
const userController = express.Router()

//Clarification des requêtes
const bodyparser = require('body-parser')
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

//Session
const session = require('express-session')
app.use(session({ secret: 'pamdev', cookie: { maxAge: 120000 }}))

const morgan = require('morgan')
const connection = require('./database/config/connection')
const Doctor = require('./database/models/Doctor')
const account = require('./controllers/account/functions.js');
const cors = require('cors');


app.use(cors())
app.use(morgan('dev'))


app.get('/', (req, res) => {
    res.end('Welcome')
});
  
  userController.get('/', (req, res) => {
    res.send('go to /admins to see all the developpers')
  })

  userController.get('/signup', (req, res) => {
    console.log(req.body)
    res.end('Inscription')
  })
  
  userController.post('/signup', account.signup)

  userController.post('/login', account.login)
  
  userController.get('/doctors', (req, res) => {
    console.log('doctors')
      Doctor.selectAll((doctors) => {
        res.json(doctors)
      })
  })

  userController.get('/doctors/:id', (req, res) => {
    console.log('doctors')
      Doctor.findUser(req.params.id, (doctors) => {
        res.status(200).send(doctors)
      })
  })
  
  userController.get('/admins', (req, res) => {
    connection.query('SELECT * from admin', (err, results) => {
      if(err) {
        return res.send(err)
      }
      else {
        return res.json({
          data: results
        })
      }
    })
  });

app.use('/user', userController)

app.listen(8000, (err) =>
console.log('Listening back on port 8000'))

/*const checkUser = function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    //Le cas où l'email ou bien le password ne serait pas soumis ou nul
    console.log('aucune donnée de requête reçue')
    res.status(400).json({
        "text": "Requête invalide"
    })
  } else {
     console.log('données de requête reçues') 

     Doctor.find(req.body.email, (err, result) => {
         if (result){
          console.log('Le docteur ' + req.body.email + ' est déjà enregistré')
          console.log(result)
          res.status(204).send('Adresse email déjà utilisée')
         }
         else {
          console.log('Inscription en cours...')
          next()
         } 
        }
      )
    }
} */




