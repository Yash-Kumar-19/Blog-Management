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
    createdAt:{
        type:Date,
        default:null
    },
    updatedAt:{
        type:Date,
        default:null
    },
    deletedAt: {
        type:Date,
        default:null
    },
    isDeleted: {
        type:boolean,
        default: false},
    publishedAt: {
        type:Date,
        default:null
    }, 
    isPublished: {
        type:boolean,
        default: false}
},{ timestamps: true });


module.exports=mongoose.model('blogs', blogsModel)