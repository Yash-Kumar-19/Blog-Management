const AuthorModel= require("../models/AuthorModel")
const validator = require("email-validator")
const jwt = require('jsonwebtoken');




//------------------Handler For Creating Authors--------------------//
const authors = async function (req, res) {
    try{
        let data = req.body //Accessing Data from from postman body
      
        // Validation For First Name
        if(!data.fname || (typeof(data.fname) != "string" || !data.fname.match(/^[A-Za-z]+$/))){
            return res.status(400).send({
                status : false,
                msg : "First Name is Missing or should contain only alphabets"
            })
        }
        //Validation For Last Name
        if(!data.lname || (typeof(data.lname) != "string"|| !data.lname.match(/^[A-Za-z]+$/))){
            return res.status(400).send({
                status : false,
                msg : "Last Name is Missing or should contain only alphabets"
            })
        }
        //Validation for title
        if(!data.title || (typeof(data.title) != "string")){
            return res.status(400).send({
                status : false,
                msg : "Title is Missing or does not have a valid input"
            })
        }
        else{
           if(data.title != "Mr" && data.title != "Mrs" && data.title != "Miss" ){
            return res.status(400).send({
                status : false,
                msg : "Title can only be Mr Mrs or Miss"
            })
         }
        }
        //Validation For Password
        if(!data.password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/)){
            return res.status(400).send({
                status:false,
                msg:"password must be at least 8 characters long contain a number and an uppercase letter"
            })
        }
       if((!data.password) || (typeof(data.password) != "string")|| (data.password.trim().length == 0)){
        return res.status(400).send({
            status : false,
            msg : "Password is Missing or does not have a valid input "
        })
       }
       //Validation For Email
       if(!data.email || (typeof(data.email) != "string")){
        return res.status(400).send({
            status : false,
            msg : "Email is Missing or has invalid input"
        })
       } 
        if(! validator.validate(data.email)){
            return res.status(400).send({
                status : false,
                msg : "Email-Id is invalid"
            })
          }
          //Checks For Unique Email Id
          let checkEmail = await AuthorModel.findOne({email : data.email})
          if(checkEmail){
               return res.status(400).send({
                   status :false,
                   msg : "Email Id already Registred"
               })
          }
       //Creating Autor Only if above validation are passed    
      let savedData = await AuthorModel.create(data)
      res.status(201).send({
        status : true,
        data : savedData
      }) 
       }
       catch(err){
        res.status(500).send({
            status : false,
            msg : err.message
        })
       }
    }
//-----------------------API for Login User---------------------------//
    const loginUser = async function (req, res) {
        let userName = req.body.email;
        let password = req.body.password;
        if(!userName || !password){
            return res.status(400).send({
                status:false,
                msg:"please enter username or password"
            })
        }
        let author = await AuthorModel.findOne({ email: userName, password: password });
        if (!author)
          return res.status(401).send({
            status: false,
            msg: "invalid usename or password",
          })
          //Token Validation
        let token = jwt.sign(
          {
            authorId: author._id.toString(), 
          },
          "project-1"
        )
        res.setHeader("x-api-key", token);
        res.status(200).send({
             status: true,
             token: token 
            })
        };


//For Exporting The Modules
module.exports.authors = authors
module.exports.loginUser=loginUser