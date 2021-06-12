module.exports = (app) => {
  const { verifySignUp } = require("../middleware");
  const products = require("../controllers/product.controller.js");
  const users = require("../controllers/user.controller.js");
  const { authJwt } = require("../middleware");

  // const test = require("../controllers/test.controller.js");

  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  var router = require("express").Router();


  app.get("/api/products", [authJwt.verifyToken], products.findAll);
  app.get("/api/products/:product_id", [authJwt.verifyToken], products.findOne);

  app.post("/api/products", [authJwt.verifyToken,authJwt.productPrivilage, verifySignUp.validateproduct], products.create);
  app.put("/api/products/:product_id", [authJwt.verifyToken,authJwt.productPrivilage], products.update);
  app.delete("/api/products/:product_id", [authJwt.verifyToken,authJwt.productPrivilage, verifySignUp.validateproduct], products.delete);
 
  // Invite
    app.post("/api/invite", [authJwt.verifyToken,verifySignUp.validateinvite], users.invite);
    app.get("/api/invite", [authJwt.verifyToken,authJwt.inviteAllPrivilage], users.inviteAll);
    app.put("/api/approveaction/:pa_id", [authJwt.verifyToken,authJwt.approvePrivilage], products.approveaction);
  
  app.use("/api", router);
};