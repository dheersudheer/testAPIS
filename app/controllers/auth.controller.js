//const db = require("../models");
const config = require("../config/auth.config");
const User = require("../models/user.model.js");
const Invite = require("../models/invite.model.js");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const dotenv =require('dotenv').config()

exports.signup = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  // Create a User
  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),

  });

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    else res.send(data);
  });
};

exports.signin = (req, res) => {
  User.findOne({email:req.body.email}, (err, data) => {
    console.log(data);
    if (err) {

    } else if (data !== null ) {
      let guess=req.body.password;
      bcrypt.compare(req.body.password, data.password, function(err, ress) {
        if(err){
          res.status(500).send({"message":"Something went wrong"});
         }else{
         if(ress){
          let token = jwt.sign(
            { id: data._id, email: data.email,role:data.role },
            process.env.TOKEN_SECRET,
            {
              expiresIn: 86400,
            }
          );
          res.status(200).send({
            user_id: data.user_id,
            email: data.email,
            role: data.role,
            access_token: token,
          });


         }else{

          res.status(401).send({    "message":"inavalid credentials"     
            
          });


         }


         }
        



      });



    }
  });
};


exports.checkuser = async (req, res) => {
  //console.log(req.body);
  try {
    data = await User.findByEmail(req.body.email);
    console.log(data);

    if (data.user_id != "") {
      let token = jwt.sign(
        { id: data.user_id, orgn_id: data.orgn_id },
        config.secret,
        {
          expiresIn: 86400,
        }
      );
	console.log('******-----********');
	
//let ress =	await User.findByIdAndUpdate(data.user_id,{user_dept:"eeeeeeeeee"},{ useFindAndModify: true })
//	ress =await User.updateLastLoginById(data.user_id)



     User.getUserPrivilages(data.user_id).then((privs) => {
        let priv_array = privs.user_privs.split(",");
        let authorities = [];
        priv_array.forEach((privname) => {
          authorities.push(privname);
        });
    console.log("Inside user privillages");
        /*
		res.status(200).send({
          id: data.user_id,
          name: data.firstname,
          email: data.email,
          roles: authorities,
          orgn_id: data.orgn_id,
          accessToken: token,
        });*/
		        res.status(200).send({
          id: data.user_id,
          name: data.firstname,
          email: data.email,
          roles: authorities,
          orgn_id: data.orgn_id,
          accessToken: token,
		            last_login: data.last_login,
        });
/*
        let request_info = {};
        let response_info = {};
        request_info = {
          email: req.body.email,
        };
        response_info = {
          id: data.user_id,
          name: data.firstname,
          email: data.email,
          roles: authorities,
          orgn_id: data.orgn_id,
          accessToken: token,
        };

        const logs = new Logs({
          ip: req.ip,
          url: req.protocol + "://" + req.get("host") + req.originalUrl,
          path: req.path,
          method: req.method,
          request: request_info,
          response: response_info,
          status: "success",
        });
        Logs.create(logs);
        // console.log(logs);
        */
      });
    } else {
      try {
        invdata = await Invite.findByEmail(req.body.email);
        if (invdata.invitation_to) {
          //Create new User in an organization

          let firstName = req.body.name.split(" ").slice(0, -1).join(" ");
          let lastName = req.body.name.split(" ").slice(-1).join(" ");
          if (firstName == "") {
            firstName = lastName;
          }

          let userrole = await Role.getUserRole(invdata.orgn_id);
          console.log(userrole);

          // Create a User
          const user = new User({
            orgn_id: invdata.orgn_id,
            firstname: firstName,
            lastname: lastName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.email, 8),
            user_type: "organization",
            user_role: userrole.role_id,
            timezone: "Asia/Kolkata",
            invited_by: invdata.invited_by,
            imported_from: null,
            user_dept: null,
            last_login: null,
            verified: 1,
            created_by: 1,
          });

          // Save User in the database
          let data = await User.firstcreate(user);
          console.log(data);
          let token = jwt.sign(
            { id: data.user_id, orgn_id: data.orgn_id },
            config.secret,
            {
              expiresIn: 86400,
            }
          );

          User.getUserPrivilages(data.user_id).then((privs) => {
            let priv_array = privs.user_privs.split(",");
            let authorities = [];
            priv_array.forEach((privname) => {
              authorities.push(privname);
            });

            res.status(200).send({
              id: data.user_id,
              name: data.firstname,
              email: data.email,
              roles: authorities,
              orgn_id: data.orgn_id,
              accessToken: token,
            });
          });

          console.log(invdata);
          res.send(invdata);
        } else {
          res.status(404).send({
            message: "User not Found",
          });
        }
      } catch (err) {
        res.status(500).send(err);
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.checkinvite = async (req, res) => {
  console.log(req.params);
  try {
    data = await Invite.findByInvite(req.params.invitecode);
    if (data.invitation_to) {
      console.log(data);
      res.send(data);
    } else {
      res.status(500).send({ massage: "Invite Not Found" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};


