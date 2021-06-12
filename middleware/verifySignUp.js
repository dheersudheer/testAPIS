//const db = require("../models");
const User = require("../models/user.model.js");
const validator = require('../helpers/validate');
checkDuplicateUsernameOrEmail = (req, res, next) => {
    User.find(req.body.email, (err, data) => {
        if (err) {
/*
              res.status(400).send({
                message: "Error retrieving User with email " + req.body.email
              });
              */
            
          } else 
        if (data.user_id) {
            res.status(400).send({
              message: "Failed! Email is already in use!"
            });
            return;
        }
      next();
    });
};

const validatesignup = (req, res, next) => {
  const validationRule = {
      "email": "required|email",
      "first_name": "required|string",
      "last_name": "required|string",
      "password": "required|string|min:6|confirmed",
  }
  validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
          res.status(412)
              .send({
                  success: false,
                  message: 'Validation failed',
                  data: err
              });
      } else {
          next();
      }
  });
}

const validateinvite = (req, res, next) => {
  const validationRule = {
      "invitation_to": "required|email"

  }
  validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
          res.status(412)
              .send({
                  success: false,
                  message: 'Validation failed',
                  data: err
              });
      } else {
          next();
      }
  });
}

const validateproduct = (req, res, next) => {
  const validationRule = {
      "product_name": "required|string",
      "product_quantity": "required|string",
      "product_description": "required|string",
      "product_price": "required|string"
      
  }
  validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
          res.status(412)
              .send({
                  success: false,
                  message: 'Validation failed',
                  data: err
              });
      } else {
          next();
      }
  });
}
const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    validatesignup:validatesignup,
    validateinvite:validateinvite,
    validateproduct:validateproduct
  };

module.exports = verifySignUp;