const nodemailer = require('nodemailer');
const Doctor = require('../../database/models/Doctor')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'parleavecmoi2019@gmail.com',
    pass: 'ccrst2019'
  }
});

const mailOptions = newUser => {
  const options = {
  from: 'parleavecmoi2019@gmail.com',
  to: newUser.email, 
  subject: 'PAM : Activation de votre compte',
  html: '<p>Bonjour `${newUser.firstname}`, Votre orthophoniste a demandé une création de votre compte sur notre plateforme.</p><p>Vous pouvez finaliser votre inscription <a href="http://localhost:3000/user/inscription">ici</a></p>'
  }
  return options
};

function mailOptionsAdmins (req, res) {
  Doctor.findOne({
    where: {
        id: req.body.doctor_id
    }
  }).then((doctor) => {
    const doctorname = doctor.firstname + ' ' + doctor.name;
    const options = {
      from: 'parleavecmoi2019@gmail.com',
      to: 'christopher.tannous@edu.ece.fr, coline.jouy@edu.ece.fr, thomas.griseau@edu.ece.fr, roch.folly@edu.ece.fr, sandrine.schutt@edu.ece.fr', 
      subject: 'PAM : New User',
      html: 'That was easy!'
      } 
  })

}

/*export const mailToAdmins = _ => {
  transporter.sendMail(mailOptionsAdmins, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
} */

function mailToUser(newUser) {
  transporter.sendMail(mailOptions(newUser), function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
}

exports.mailToUser = mailToUser;



//module.exports = mailer