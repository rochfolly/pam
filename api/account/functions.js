const Doctor = require('../../database/models/Doctor')
const User = require('../../database/models/User')
const passwordHash = require("password-hash");  
const jwt = require('jsonwebtoken')

process.env.SECRET_KEY = 'secret'

function signup (req, res) {

    if(!req.body.email || !req.body.password) {
        console.log('Requête invalide')
        res.status(404).end('Requête invalide')
    }   
    else {    
      const today = new Date()
      const newdoctor = {
        firstname: req.body.firstname,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        job: req.body.job,
        city: req.body.city,
        phone: req.body.phone,
        created: today
    }

    Doctor.findOne({
        where: {
            email: req.body.email
        }
    })
        .then((doctor) => {
            doctor ? console.log('déjà existant') : console.log("Inscription en cours")
            if (!doctor) {
                newdoctor.password = passwordHash.generate(req.body.password)                   
                Doctor.create(newdoctor)
                .then(doctor => {
                    console.log(doctor.email + ' registered')
                    let token = jwt.sign(doctor.dataValues, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    })
                    res.send(token)
                    })
                    .catch(err => {
                            res.send('error: ' + err)
                    })
            } else {
                res.send({ error: "Ce docteur existe déjà" })
                console.log("Ce docteur existe déjà")
            }
        })
        .catch(err => {
            console.log('Erreur')
            res.send('error: ' + err)            
        })
    }

}

function login(req, res) {

    if(!req.body.email || !req.body.password) {
        console.log('Requête invalide')
        res.status(404).end('Requête invalide')
    }
    else {
      Doctor.findOne({
        where: {
            email: req.body.email
        }
      })
        .then(doctor => {
            if (doctor) {
                console.log('verification')
                if (passwordHash.verify(req.body.password, doctor.password)) {
                    console.log('mot de passe correct')
                    console.log(doctor.dataValues)
                    let token = jwt.sign(doctor.dataValues, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    })
                    res.send(token)
                }
                else res.status(404).end('mot de passe incorrect')
            } else {
                console.log('Email incorrect')
                res.status(400).json({ error: 'User does not exist' })
            }
        })
        .catch(err => {
            res.status(400).json({ error: err })
        })
    }
}  

function createUser (req, res) {
    if(!req.body.email || !req.body.firstname) {
        console.log('Requête invalide')
        res.status(404).end('Requête invalide')
    }
    else {
        const newUser = {
            doctor_id: req.body.doctor_id,
            firstname: req.body.firstname,
            name: req.body.name,
            email: req.body.email
        }
        User.findOne({
            where: {
                email: req.body.email
            }
        })
        .then((user) => {
            if(user){
                console.log('Ce Patient existe déjà')
                res.status(204).end('Ce Patient existe déjà')
            }
            else{
                User.create(newUser)
                .then(user => {
                   //console.log(user.firstname + 'ajouté')
                   console.log(user.dataValues)
                   res.send(user.dataValues)
                })
            }
        })
     }
}

              
/*
     function (error) {
                switch (error) {
                    case 500:
                        res.status(500).json({
                            "text": "Erreur interne"
                        })
                        break;
                    case 204:
                        res.status(204).json({
                            "text": "L'adresse email existe déjà"
                        })
                        break;
                    default:
                        res.status(500).json({
                            "text": "Erreur interne"
                        })
                }
            }
*/

exports.createUser = createUser;
exports.signup = signup;
exports.login = login;