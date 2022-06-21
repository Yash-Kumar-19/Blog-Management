const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

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
    authorId:{
        type:ObjectId,
        ref:"Author"
    },
    tags: [Array], 
    category: {
        type:String,
        required:true
    },
    subcategory:{
        type:[String],
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type:Boolean,
        default: false
    },
},{ timestamps: true });


module.exports=mongoose.model('blogs', blogsModel)