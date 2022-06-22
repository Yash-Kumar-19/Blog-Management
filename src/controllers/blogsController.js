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


const updateBlog = async function(req, res){
   
  try{
      let requestBlogId = req.params.blogId
      let newTags = req.body.tags
      let newTitle = req.body.title
      let newBody= req.body.body
      let newSubCategory = req.body.subcategory
      let published = req.body.isPublished
     
      
      if(!requestBlogId){
          return res.status(400).send({
              status : false,
              msg : "BlogId is required"
          })
      }
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
              {subcategory : newSubCategory},
              {new : true} )
      }
      if(published){
          if(published == true)
          updatedBlog = await blogsModel.findOneAndUpdate(
              {_id : requestBlogId}, 
              {isPublished : true, publishedAt : Date.now()},
              {new : true})
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

const deleteBlogs = async function(req , res){
  try{
      let requestBlogId = req.params.blogId
      
      if(!requestBlogId){
          return res.status(400).send({
              status : false,
              msg : "BlogId is required"
          })
      }
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
      let deleteBlog = await blogsModel.findOneAndUpdate(
          {_id : requestBlogId},
          {isDeleted : true, deletedAt : Date.now()},
          {new : true, upsert : true}
      )
      res.status(200).send({
          status : true,
          data : deleteBlog
      })
  }
  catch(err){
     res.status(500).send({
      status : false,
      msg : err.message
     })
  }
}


module.exports.createBlog=createBlog 
module.exports.displayBlog=displayBlog 
module.exports.updateBlog = updateBlog
module.exports.deleteBlogs = deleteBlogs