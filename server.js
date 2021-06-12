const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

global.__basedir = __dirname;

var corsOptions = {
 // origin: "http://128.199.27.139/"
 origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json( ));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

  require("./app/routes/all.routes")(app);
  require("./app/routes/auth.routes")(app);
  const publicDir = require('path').join(__dirname,'./resources'); 
    app.use(express.static(publicDir)); 
 //   app.use(express.static(require('path').join(__dirname, '../resources')));

 
// set port, listen for requests
const PORT = process.env.PORT || 8080;
var server=app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

server.setTimeout(0);