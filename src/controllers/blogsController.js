const blogsModel= require("../models/blogsModel")
const AuthorModel=require("../models/AuthorModel")

//--------------------Handler For Creating Blogs--------------------------//
const createBlog= async function (req, res) {
    try{
    let blog = req.body
    let author_Id=blog.authorId
    if(!author_Id){
        return res.send({
            status:false,
            msg:"Author ID required"
        })}
        if (!author_Id.match(/^[0-9a-f]{24}$/)){
          return res.status(400).send({
              status : false,
              msg : "Not a valid ObjectId"
          })
       }

    let author=await AuthorModel.findById(author_Id)
    if(!author){
        return res.send({
            status:false,
            msg:"Enter valid Auther ID"
        })}


    if(!blog.title || (typeof(blog.title) != "string")){
        return res.status(400).send({
            status:false,
            msg:"Title is Missing or has invali entry"
        })
    }

    if(!blog.body || (typeof(blog.body) != "string")){
        return res.status(400).send({
            status:false,
            msg:"Body is Missing or has invalid entry"
        })}


    if(!blog.category || (typeof(blog.category) != "string")){
        return res.status(400).send({
        status:false,
        msg:"Cateegory is missing or has invalid entry"
    })};

    
    let blogCreated = await blogsModel.create(blog)
    res.status(201).send({data: blogCreated})
    }
    catch (err) {
        console.log("Eror:", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}




//---------------------Handler For Displaying Blogs----------------------//
const displayBlog = async function (req, res){
try{
    let filterCondition = req.query
  if(filterCondition.authorId){
    if (!filterCondition.authorId.match(/^[0-9a-f]{24}$/)){
      return res.status(400).send({
          status : false,
          msg : "Not a valid ObjectId"
      })
   }
  }
  let displayingData = await blogsModel.find({$and :[filterCondition, {isDeleted : false}, {isPublished : true},]})
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
    msg : err.message
  })
  }
}

//-----------------------Handler For Updating Blogs------------------------//
const updateBlog = async function(req, res){
   
  try{
      let requestBlogId = req.params.blogId
      let updateRequest = req.body
      if(Object.keys(updateRequest).length == 0){
        return res.status(400).send({
            status: false,
            msg : "Mentiom the fields to be updated"
        })
      }
      let newTags = updateRequest.tags
      let newTitle = updateRequest.title
      let newBody= updateRequest.body
      let newSubCategory = updateRequest.subcategory
      let published = updateRequest.isPublished
     
    
       if (!requestBlogId.match(/^[0-9a-f]{24}$/)){
          return res.status(400).send({
              status : false,
              msg : "Not a valid ObjectId"
          })
       }
     let updateId = await blogsModel.findById(requestBlogId)
     if(!updateId || (updateId.isDeleted == true)){
         return res.status(404).send({
             status : false,
             msg : "Request Id not Found"
         })         
     }
     let updatedBlog
     if(newTags){
     let updatedTags = updateId.tags
      updatedTags.push(newTags)
      updatedBlog = await blogsModel.findOneAndUpdate(
          {_id : requestBlogId}, 
          {tags : updatedTags},
          {new : true} )
     }
     if(newTitle){
      updatedBlog = await blogsModel.findOneAndUpdate(
          {_id : requestBlogId}, 
          {title : newTitle},
          {new : true} )
      }
      if(newBody){
          updatedBlog = await blogsModel.findOneAndUpdate(
              {_id : requestBlogId}, 
              {body : newBody},
              {new : true} )
      }
      if(newSubCategory){
          let updatedSubCategory = updateId.subcategory
          updatedSubCategory.push(newSubCategory)
          updatedBlog = await blogsModel.findOneAndUpdate(
              {_id : requestBlogId}, 
              {subcategory : updatedSubCategory},
              {new : true} )
      }
      if(published){
          if(published == true)
          updatedBlog = await blogsModel.findOneAndUpdate(
              {_id : requestBlogId}, 
              {isPublished : true, publishedAt : Date.now()},
              {new : true, upsert : true})
      }

     res.status(200).send({
      status: true,
      data : updatedBlog
     })
 }
 catch(err){
  res.status(500).send({
   status : false,
   msg : err.message
  })
}
}

//---------------------------Handler For Deleting Blogs By BlogId-----------------------------//
const deleteBlogs = async function(req , res){
  try{
      let requestBlogId = req.params.blogId
      
         if (!requestBlogId.match(/^[0-9a-f]{24}$/)){
          return res.status(400).send({
              status : false,
              msg : "Not a valid ObjectId"
          })
       }
      let deleteId = await blogsModel.findById(requestBlogId)
      if(!deleteId || (deleteId.isDeleted == true)){
          return res.status(404).send({
              status : false,
              msg : "Request Id not Found"
          })         
      }
       await blogsModel.findOneAndUpdate(
          {_id : requestBlogId},
          {isDeleted : true, deletedAt : Date.now()},
          {new : true, upsert : true}
      )
      res.status(204).send()
  }
  catch(err){
     res.status(500).send({
      status : false,
      msg : err.message
     })
  }
}

//------------------Handler for Deleting Blogs by Query------------------------//
const deleteByQuery = async function (req, res) {

    try {

      let data = req.query
        const deleteByQuery = await blogsModel.updateMany(
  
        { $and: [data ,{authorId : req.id}, { isDeleted: false }] },
  
        { $set: { isDeleted: true ,deletedAt:new Date()} },
  
        { new: true })
  
        if (deleteByQuery.modifiedCount==0) 
        return res.status(404).send(
          { status: false,
             msg: "No Blog Found"
           })
  
        res.status(204).send()
    }
  
    catch (err) {
        res.status(500).send({
          status:false,
          msg: err.message 
        })}
  }





//For Exporting The Modules
module.exports.createBlog=createBlog 
module.exports.displayBlog=displayBlog 
module.exports.updateBlog = updateBlog
module.exports.deleteBlogs = deleteBlogs
module.exports.deleteByQuery=deleteByQuery