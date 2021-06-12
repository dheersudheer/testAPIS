const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");


verifyToken = (req, res, next) => {

  token = req.headers["access_token"];
  if (!token) {
    return res.status(403).send({
      message: "access_token is missing!",
    });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.user_id = decoded.id;
    req.role = decoded.role;
    next();
  });
};

productPrivilage= async (req, res,next) => {
  try {
   // data = await User.find(req.params.user_id);
   console.log('req.role is '+req.role)
    if (req.role =="admin" || req.role == "SuperAdmin") {
      console.log('here');
      next();

    } else {
      res.status(500).send({ massage: "Not a valid role to add/update product" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};


inviteAllPrivilage= async (req, res,next) => {
  try {
    if (req.role == "SuperAdmin") {
      next();
    } else {
      res.status(500).send({ massage: "Not a valid role to get invite list" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

approvePrivilage= async (req, res,next) => {
  try {
    if (req.role == "SuperAdmin") {
      next();
    } else {
      res.status(500).send({ massage: "Not a valid role to approve the changes" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const authJwt = {
  verifyToken: verifyToken,
  productPrivilage:productPrivilage,
  inviteAllPrivilage:inviteAllPrivilage,
  approvePrivilage:approvePrivilage
};
module.exports = authJwt;
