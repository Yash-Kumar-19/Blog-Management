const blogsModel= require("../models/blogsModel")
const AuthorModel=require("../models/AuthorModel")

//--------------------Handler For Creating Blogs--------------------------//
const createBlog= async function (req, res) {
    try{
    let blog = req.body
    let author_Id=blog.authorId
    //checks if author id is coming in request or not
    if(!author_Id){
        return res.send({
            status:false,
            msg:"Author ID required"
        })}
        //Object Id validation for authorId
        if (!author_Id.match(/^[0-9a-f]{24}$/)){
          return res.status(400).send({
              status : false,
              msg : "Not a valid ObjectId"
          })
       }

    let author=await AuthorModel.findById(author_Id)
    //Checks if any document is present in database with specified author Id
    if(!author){
        return res.send({
            status:false,
            msg:"Enter valid Auther ID"
        })}

    // Validation for Title
    if((!blog.title) || (typeof(blog.title) != "string") || (blog.title.trim().length == 0)){
        return res.status(400).send({
            status:false,
            msg:"Title is Missing or has invali entry"
        })
    }
    //Validation for Body
    if(!blog.body || (typeof(blog.body) != "string") || (blog.body.trim().length == 0)){
        return res.status(400).send({
            status:false,
            msg:"Body is Missing or has invalid entry"
        })}
    //Function which validates elements of tags and sub-category array
    const isValid = function(arr){
        let f_arr = arr.filter((contents) => typeof(contents)== "string" && contents.trim().length!=0)
        return arr.length == f_arr.length
    }
    //validation for tags 
    if(isValid(blog.tags) == false){
        return res.status(400).send({
            status : false,
            msg : "Invalid input for tags"
        })
    }
    //validation for sub-category
    if(isValid(blog.subcategory) == false){
        return res.status(400).send({
            status : false,
            msg : "Invalid input for subcategory"
        })
    }
    // Validation for Category
    if(!blog.category || (typeof(blog.category) != "string") || (blog.category.trim().length == 0)){
        return res.status(400).send({
        status:false,
        msg:"Cateegory is missing or has invalid entry"
    })};

    
    let blogCreated = await blogsModel.create(blog)
    res.status(201).send({
        status : true,
        data: blogCreated
    })
    }
    catch (err) {
        console.log("Eror:", err.message)
        res.status(500).send({ 
            status : false,
            msg: "Error", error: err.message })
    }
}




//---------------------Handler For Displaying Blogs----------------------//
const displayBlog = async function (req, res){
try{
    
    let filterCondition = req.query

    //Validation If authorId is present
  if(filterCondition.authorId){
    if (!filterCondition.authorId.match(/^[0-9a-f]{24}$/)){
      return res.status(400).send({
          status : false,
          msg : "Not a valid ObjectId"
      })
   }
  }
  //Displaying Data which matches filter condition and is published and not deleted
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
      //Checks if any condition is coming in request for updation
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
     
   
     let updateId = await blogsModel.findById(requestBlogId)
     if(!updateId || (updateId.isDeleted == true)){
         return res.status(404).send({
             status : false,
             msg : "Request Id not Found"
         })         
     }

     let updatedBlog 

    
     if((newTags) && (typeof(newTags)== "string") && (newTags.trim().length != 0)){
     let updatedTags = updateId.tags
      updatedTags.push(newTags)
      updatedTags = [...new Set(updatedTags)] //Removes Duplicate Tags
      updatedBlog = await blogsModel.findOneAndUpdate(
          {_id : requestBlogId}, 
          {tags : updatedTags},
          {new : true} )
     }

     if(newTitle && (typeof(newTitle)== "string") && (newTitle.trim().length != 0)){
      updatedBlog = await blogsModel.findOneAndUpdate(
          {_id : requestBlogId}, 
          {title : newTitle},
          {new : true} )
      }

      if(newBody && (typeof(newBody)== "string") && (newBody.trim().length != 0)){
          updatedBlog = await blogsModel.findOneAndUpdate(
              {_id : requestBlogId}, 
              {body : newBody},
              {new : true} )
      }

      if(newSubCategory && (typeof(newSubCategory)== "string") && (newSubCategory.trim().length != 0)){
          let updatedSubCategory = updateId.subcategory
          updatedSubCategory.push(newSubCategory)
          updatedSubCategory = [...new Set(updatedSubCategory)] //Removes Duplicate SubCategories
          updatedBlog = await blogsModel.findOneAndUpdate(
              {_id : requestBlogId}, 
              {subcategory : updatedSubCategory},
              {new : true} )
      }

      if(published == true && updateId.isPublished == false){ 
          if(published == true)
          updatedBlog = await blogsModel.findOneAndUpdate(
              {_id : requestBlogId}, 
              {isPublished : true, publishedAt : Date.now()},
              {new : true, upsert : true})
      }
      
    if(!updatedBlog){
        return res.status(400).send({
            status : false,
            msg :" No data updated due to invalid request or data is already published"
        })
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
      res.status(200).send()
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
  
        res.status(200).send()
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