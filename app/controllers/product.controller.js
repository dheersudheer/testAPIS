const User = require("../models/user.model.js");
const Product = require("../models/product.model");
const Pendingactions= require("../models/pendingactions.model");
const nodemailer = require("nodemailer");

exports.create = (req, res) => {
  // Create a Document
    var role=req.role;
    var email=req.email;
    console.log("role is "+req.role);
    const product = new Product({
        product_name: req.body.product_name,
        product_quantity: req.body.product_quantity,
        product_description: req.body.product_description,
        product_price: req.body.product_price,
        added_by: req.user_id,
        updated_by: req.user_id,
        status:1,
    });




    if(req.role =='admin'){
      console.log('role is '+req.role)
      
        const pa = new Pendingactions({
        user_id: req.user_id,
        request_object: product,
        request_action: "add",
        request_module: "product",
        status: "Pending",
        });
        Pendingactions.create(pa, async(err, data) => {
           if (err)
            res.status(500).send({message: err.message || "Some error occurred while creating the User.",});
            else {

            return res.send({"message" : "add request sentsuccesfully"})
            }
        })
    }else{

      Product.create(product, async(err, data) => {
        if (err)
            res.status(500).send({message: err.message || "Some error occurred while creating the User.",});
        else {
                     return res.send(data)
            } 
        })

      }
    



  }         

// Retrieve all Documents from the database.
exports.findAll = (req, res) => {
    Product.find().then((data) => {
      return res.send(data);

      //res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving documents.",
      });
    });
};




exports.findOne = (req, res) => {
  Product.findById(req.params.product_id).then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Document with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Document with id=" + id });
    });
};


// Update a Document by the id in the request
exports.update = async(req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.product_id;

  let prod={
    "product_name":req.body.product_name,
    "product_quantity":req.body.product_quantity,
    "product_description":req.body.product_description,
    "product_price":req.body.product_price
   }


    if(req.role =='admin'){
      console.log('role is '+req.role)
        const pa = new Pendingactions({
        user_id: req.user_id,
        request_object: prod,
        request_action: "update",
        request_module: "product",
        status: "Pending",
        });
        Pendingactions.create(pa, async(err, data) => {
           if (err)
            res.status(500).send({message: err.message || "Some error occurred while creating the User.",});
            else {

            return res.send({"message" : "update request sent succesfully"})
            }
        })
    }else{
          Product.findByIdAndUpdate(id,prod, async(err, data) => {
              if (err)
                res.status(500).send({message: err.message || "Some error occurred .",});
              else {
              return res.send({'message':'Product updated succefully','data':data})
              } 
              })
      }
    }
 /* 
        Product.findByIdAndUpdate(id,Prod, async(err, data) => {
          if (err)
              res.status(500).send({message: err.message || "Some error occurred .",});
          else {
                      if(req.role =='admin'){
                let sent_mail= await sendmailAction('Product Updated','updated',req.body.product_name,res)
                return res.send({'message':'Product updated succefully','data':data})
              }else{
                return res.send({'message':'Product updated succefully','data':data})
              } 
          }
    })
    */



// Delete a Document with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  prod={
    product_id:id

  }
  if(req.role =='admin'){
    console.log('role is '+req.role)
      const pa = new Pendingactions({
      user_id: req.user_id,
      request_object: prod,
      request_action: "Delete",
      request_module: "product",
      status: "Pending",
      });
      Pendingactions.create(pa, async(err, data) => {
         if (err)
          res.status(500).send({message: err.message || "Some error occurred while creating the User.",});
          else {

          return res.send({"message" : "deleted request sentsuccesfully"})
          }
      })
  }else{

  
    Product.findByIdAndRemove(id, { useFindAndModify: false }, async(err, data) => {
      if (err)
          res.status(500).send({message: err.message || "Some error occurred .",});
      else {         
              return res.send({'message':'Product deleted '})
        
      }
  })

   }
  };

async function sendmailAction(subject,to_mail,type,product_name,res){
  return new Promise((resolve, reject) => {
    User.findOne({"role":"SuperAdmin"}).then((data)=>{
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
          user: process.env.smtp_login,
          pass: process.env.smtp_password,
        },
        tls: { rejectUnauthorized: false },
      });
      let html_msg ="Hi,<p>"+to_mail +" has "+type+" product "+product_name+"</p> <br/><br/>Thank you.<br/>Team test.";
      let mailOptions = {
          from: process.env.smtp_login,
          to:  data.email ,
          subject: subject,
          html: html_msg
      };
    //  console.log('+++++++++')
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
      // console.log("Error while sending email" +error)
       // res.status(500).send({ message: error,});
        } else {
          console.log('mail sent')
          resolve(info)
          
        }
      });
  
  
    }).catch((error) => {
      resolve(error)
      /*
      res.status(500).send({
        message: "Error",
        error: error.message,
      });*/
    })

  })
}




exports.approveaction = (req, res) => {
  // Create a Document
    const id = req.params.pa_id;
    const pa = {
        status: req.body.status,
    };
    
    Pendingactions.findByIdAndUpdate(id,pa,{ useFindAndModify: false }, async(err, data) => {
      if (err)
        res.status(500).send({message: err.message || "Some error occurred .",});
      else {
      if(data.action=='add'){
          const product = new Product({
            product_name: data.product_name,
            product_quantity: data.product_quantity,
            product_description: data.product_description,
            product_price: data.product_price,
            added_by: data.user_id,
            updated_by: data.user_id,
            status:1,
          });

          Product.create(product, async(err, pdata) => {
            if (err)
              res.status(500).send({message: err.message || "Some error occurred while creating the User.",});
             else {
              return res.send({"message":"Product add Approved succefully"})
              } 
          })
  
        }else if(data.action=='update'){
          let prod={
            "product_name":data.product_name,
            "product_quantity":data.product_quantity,
            "product_description":data.product_description,
            "product_price":data.product_price
           }

          Product.findByIdAndUpdate(data.id,prod, async(err, pdata) => {
            if (err)
              res.status(500).send({message: err.message || "Some error occurred .",});
            else {
            return res.send({'message':'Product updated  Approved Succefully'})
            } 
            })

        }else{
          Product.findByIdAndRemove(id, { useFindAndModify: false }, async(err, data) => {
            if (err)
                res.status(500).send({message: err.message || "Some error occurred .",});
            else      
            return res.send({'message':'Product delete Approved succefully'})
        })


        }
        
      }

    })


  }