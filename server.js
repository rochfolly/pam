//Express
const express = require('express');
const app = express()

//Routes
const doctorController = express.Router()
const userController = express.Router()

//Clarification des requêtes
const bodyparser = require('body-parser')
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

//Session
const session = require('express-session')
//app.use(session({ secret: 'pamdev', cookie: { maxAge: 120000 }}))

const morgan = require('morgan')
//const connection = require('./database/config/connection')

const Prescriprion = require('./database/models/Prescription')
const Doctor = require('./database/models/Doctor')
const User = require('./database/models/User')
const Score = require('./database/models/Score')


const account = require('./api/account/functions.js');
const exercice = require('./api/exercice/functions.js')
const mails = require('./api/mail/mailer.js')

const audio = require ('./txtToSpeech.js')


const cors = require('cors');
app.use(cors())
app.use(morgan('dev'))


app.get('/', (req, res) => {
    res.end('Welcome')
});
  
/////////////////////////////////////////////////  Doctor  ////////////////////////////////////////////////////////
  doctorController.get('/', (req, res) => {
    res.send('go to /admins to see all the developpers')
  })

  doctorController.get('/signup', (req, res) => {
    console.log(req.body)
    res.end('Inscription')
  })
  
  //Inscription
  doctorController.post('/signup', account.signup)
  
  //Connexion
  doctorController.post('/login', account.login)
  
  doctorController.get('/:id', (req, res) => {
    console.log('doctors')
      Doctor.findAll({
        where: {
          id: req.params.id
        }
      }).then((doctor) => res.json(doctor))
  })

  doctorController.get('/users/:id', (req, res) => {
    User.findAll({
      where: {
        doctor_id: req.params.id
      }
    })
    .then((users) => {
      //console.log(users[0].dataValues)
      var usersArray = []      
      users.forEach((user, index) =>
      usersArray[index] = [
        user.dataValues.id, 
        user.dataValues.firstname,
        user.dataValues.name,
        user.dataValues.email,
      ])
      console.log(usersArray)
      res.send(usersArray)
     })
  })

  doctorController.get('/user/:id', (req, res) => {
    User.findOne({
      where: {
        id: req.params.id
      }
    }).then((user) => res.send(user.dataValues))
  })


  doctorController.get('/doctors', (req, res) => {
    console.log('doctors')
      Doctor.findAll()
      .then((doctors) => res.send(doctors))
      
  })

  doctorController.post('/update', account.updateDoctor)
  
  doctorController.get('/user/:id/exercices', exercice.fetch)

  doctorController.get('/user/:id/exercices/other', exercice.fetchOther)

  doctorController.get('/user/:id/exercices/checkOther', exercice.checkOther)
  
   
/////////////////////////////////////////////////  User  ////////////////////////////////////////////////////////


userController.get('/', (req, res) => {
  res.end('Go to /users to see all the users')
})

userController.get('/users', (req, res) => {
  User.findAll().then((users) => {
    res.end(users)
  })
})

userController.delete('/:user_id/prescription/:exo_id', (req, res) => {
  Prescriprion.destroy({
    where: {
     user_id : req.params.user_id,
     exo_id : req.params.exo_id
    }
  })
})


userController.post('/:user_id/prescription/update', exercice.updatePrescription)

userController.post('/:user_id/prescription/add', exercice.addPrescription)


userController.post('/new', (req, res) => {
   mails.mailToUser(req.body.user)
})

userController.post('/create', account.createUser)

userController.post('/update', account.updateUser)

userController.post('/:new_id/first', exercice.createFirst)



userController.post('/:user_id/:exo_id/result/:score', (req, res) => {
  const newScore = {
    user_id: req.params.user_id,
    value: req.params.score,
    exo_id: req.params.exo_id,
    created: new Date()
  }
  Score.create(newScore).then(score => res.send(score))
})

userController.get('/:id/stats', exercice.getStats)

userController.get('/:id/stats/:exo_id', exercice.getSingleStats)

userController.get('/:id/level/:exo_id', exercice.getLevel)

userController.get('/:id/global', exercice.getGlobal)

userController.get('/:id/jauge', exercice.fillJauge)


userController.post('/result', (req, res) => {
  Score.create(req.body.score).then(score => res.send(score))
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/textts/:question', audio.textToSpeech)

app.use('/doctor', doctorController)
app.use('/user', userController)


app.post('/score', (req, res) =>{
  res.json(req.body)
})

app.listen(8000, (err) =>
console.log('Listening back on port 8000'))

/*const checkdoctor = function(req, res, next) {
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




