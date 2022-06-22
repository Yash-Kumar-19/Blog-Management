const blogsModel= require("../models/blogsModel")
const AuthorModel=require("../models/AuthorModel")

const createBlog= async function (req, res) {
    try{
    let blog = req.body
    let author_Id=blog.authorId
    if(!author_Id){
        return res.send({
            status:false,
            msg:"Author ID required"
        })}

    let author=await AuthorModel.findById(author_Id)
    if(!author){
        return res.send({
            status:false,
            msg:"Enter valid Auther ID"
        })}


    if(!blog.title){
        return res.status(400).send({
            status:false,
            msg:"Title is Mandatory"
        })
    }

    if(!blog.body){
        return res.status(400).send({
            status:false,
            msg:"Body is Mandatory"
        })}


    if(!blog.category){
        return res.status(400).send({
        status:false,
        msg:"category is Mandatory"
    })};

    
    let blogCreated = await blogsModel.create(blog)
    res.status(201).send({data: blogCreated})
    }
    catch (err) {
        console.log("Eror:", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}



const displayBlog = async function (req, res){
try{
    let filterCondition = req.query
  if(Object.keys(filterCondition).length == 0){
    let displayingData = await blogsModel.find({isDeleted : false , isPublished:true})
    if(displayingData.length == 0){
      return res.status(404).send({
        status : false,
        msg : "No documents found 1"
      })
    }
    return res.status(200).send({
      status : true, 
      data : displayingData
    })
  }
  let displayingData = await blogsModel.find({$and :[filterCondition, {isDeleted : false}, {isPublished : true}]})
  if(displayingData.length == 0){
    return res.status(404).send({
      status : false,
      msg : "No matcing document"
    })
  }
   res.status(200).send({
    status : true, 
    data : displayingData
  })


}
catch(err){
  res.status(500).send({
    status : false,
    data : err.message
  })
  }
}
module.exports.createBlog=createBlog 
module.exports.displayBlog=displayBlog 