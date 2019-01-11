const connection = require('../../config/connection')
const jwt = require('jwt-simple');
const token = require('../config/secret')


class Doctor {

  constructor(doctor){
    this.firstname = doctor.firstname,
    this.name = doctor.name,
    this.email = doctor.email,
    this.password = doctor.password,
    this.job = doctor.job,
    this.city = doctor.city,
    this.phone = doctor.phone
   }

   static save(doctor, cb) {
      connection.query('INSERT into doctor SET prenom = ?, nom = ?, email = ?, password = ?, domaine = ?, ville = ?, phone = ?, date_inscription = ?',
        [doctor.firstname, doctor.name, doctor.email, doctor.password, doctor.job, doctor.city, doctor.phone, new Date()], (err, result) => {
          if (err) throw (err)
          cb(result)
        }
      )
   }

   static selectAll(cb) {
     connection.query('SELECT * from doctor', (err, rows) => {
       if(err) throw err
       cb(rows)
     })
   }

   static find(email, cb) {
    connection.query('SELECT * FROM doctor WHERE email = ?', email, (err, rows) => {
        if(err) throw err
        cb(rows)
    })
  }

   static findUser(id, cb) {
    connection.query('SELECT * FROM doctor WHERE doctor_id = ?', id, (err, rows) => {
        if(err) throw err
        cb(rows)
    })
  }

   static login(user, cb) {
     connection.query('SELECT * FROM doctor WHERE email = ? AND password = ?', [user.email, user.password], (err, rows) => {
      if (err) throw err
      cb(rows)
     })
   } 

    static getToken () {
      return jwt.encode(this, token.secret);
    }
  
}

module.exports = Doctor;


