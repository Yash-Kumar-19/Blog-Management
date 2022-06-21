<<<<<<< HEAD
const UserModel= require("../models/blogsModel")
=======
const UserModel= require("../models/AuthorModel")
>>>>>>> e896a891e965a39c7f54b4d392495f10de6b49a9

const createUser= async function (req, res) {
    let data= req.body
    let savedData= await UserModel.create(data)
    res.send({msg: savedData})
}

const getUsersData= async function (req, res) {
    let allUsers= await UserModel.find()
    res.send({msg: allUsers})
}

module.exports.createUser= createUser
module.exports.getUsersData= getUsersData