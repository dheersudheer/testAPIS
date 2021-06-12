const User = require("../models/user.model.js");
const Invite = require("../models/invite.model.js");
const nodemailer = require("nodemailer");
const dotenv =require('dotenv').config();
var bcrypt = require("bcryptjs");


exports.invite =async (req, res) => {

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.smtp_login,
      pass: process.env.smtp_password,
    },
    tls: { rejectUnauthorized: false },
  });
  //let invitation_link= await bcrypt.hashSync(req.body.invitation_to, 8);
  let invitation_link = Math.random().toString(36).slice(2);

  const invite = new Invite({
     invited_by: req.user_id,
    invitation_to: req.body.invitation_to,
    invitation_link: invitation_link,
    status: "Invited",
  });
    // Save invite in the database
  Invite.create(invite, (err, data) => {
    if (err) {
      console.log("error in initation added")
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Invite.",
      });
    } else {
      console.log("invitation added")
        let html_msg =
      "Hi, <br/><br/>You have been invited, to create an account in test. <br/><br/>Please click on this <a href='http://localhost:8080/login?invite=" +
      invitation_link +
      "'>link</a> to proceed.<br/><br/>Thank you.<br/>Team test.";
  
      let mailOptions = {
        from: process.env.smtp_login,
        to: req.body.invitation_to,
        subject: "Invite from test Portal",
        html: html_msg,
      };
      transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error while sending email" +error)

        res.status(500).send({
          message: error,
        });
      } else {
        res.status(200).send({"message":"Invitation sent"} );
        // console.log('Email sent: ' + info.response);
      }
    });
     
    }
   // res.send(data);
  });

};


// Retrieve all Users from the database.
exports.inviteAll = (req, res) => {
  Invite.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};






