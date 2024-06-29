const mongoose=require("mongoose");
const Schema=mongoose.Schema({
    title:{type:String,required:true},
    author:{type:String,required:true},
    user_id:{type:String,required:true},
    createdAt: { type: Date, default: Date.now }
});
const BookModel=mongoose.model("books",Schema);
module.exports=BookModel;