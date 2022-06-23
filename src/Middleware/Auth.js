const jwt = require("jsonwebtoken");


const jwtValidation = function(req, res, next){
try {  
  let token = req.headers["x-Api-Key"];
if (!token) token = req.headers["x-api-key"];

if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

 jwt.verify(token, "project-1", (err , decoded) => {
    if(err){
        return res.status(401).send({
            status : false,
            msg : "Authentication Failed"
        })
    }
    else{
        req.token = decoded
      next()
    }
 }) 
}
catch (err){
  console.log("this error is from token validation", err.message)
  res.status(500).send({msg : err.message})
}
}

module.exports.jwtValidation = jwtValidation