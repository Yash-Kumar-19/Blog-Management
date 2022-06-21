const blogsModel= require("../models/blogsModel")

const createBlog= async function (req, res) {
    try{
    let blog = req.body
    let autherId=blog.authorId

    if(!autherId){return res.status(400).send("Auther ID requied")}
    let auther=await blogsModel.findById(autherId)
    if(!auther){return res.status(400).send("Enter a valid auther ID")}

    if(!blog.title){return res.status(400).send("Title is Mandatory")}
    if(!blog.body){return res.status(400).send("Body is Mandatory")}
    if(!blog.category){return res.status(400).send("category is Mandatory")}
    
    let blogCreated = await blogsModel.create(blog)
    res.status(201).send({data: blogCreated})
    }
    catch (err) {
        console.log("Eror:", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

module.exports.createBlog=createBlog 