const AuthorModel= require("../models/AuthorModel")
const validator = require("email-validator")

const authors = async function (req, res) {
    try{
        let data = req.body //Accessing Data from from postman body
      
    
        if(!data.fname || (typeof(data.fname) != "string")){
            return res.status(400).send({
                status : false,
                msg : "First Name is Missing or type is invalid"
            })
        }
        if(!data.lname || (typeof(data.lname) != "string")){
            return res.status(400).send({
                status : false,
                msg : "Last Name is Missing"
            })
        }
        if(!data.title || (typeof(data.title) != "string")){
            return res.status(400).send({
                status : false,
                msg : "Title is Missing"
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
       if(!data.password || (typeof(data.password) != "string")){
        return res.status(400).send({
            status : false,
            msg : "Password is Missing"
        })
       }
       if(!data.email || (typeof(data.email) != "string")){
        return res.status(400).send({
            status : false,
            msg : "Email is Missing"
        })
       } 
       else{
          if(! validator.validate(data.email)){
            return res.status(400).send({
                status : false,
                msg : "Email-Id is invalid"
            })
          }
       }
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

module.exports.authors = authors