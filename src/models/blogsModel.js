const mongoose = require('mongoose');

const blogsModel=new mongoose.Schema(
    {
    title: {
        type:String,
        required:true
    }, 
    body: {
        type:String,
        required:true
    },
    // authorId: {mandatory, 
    // refs to author model},
    tags: [Array], 
    category: {
        type:String,
        required:true
    },
    subcategory:{
        type:[String],
    },
    createdAt:Date,
    updatedAt:Date,
    deletedAt: {when the document is deleted},
    isDeleted: {boolean, default: false},
    publishedAt: {when the blog is published}, 
    isPublished: {boolean, default: false}
},{ timestamps: true });


module.exports=mongoose.model('blogs', blogsModel)