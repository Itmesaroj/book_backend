const mongoose=require("mongoose");
const Schema=mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:[String],required:true}
})
const UserModel=mongoose.model('registers',Schema);
module.exports=UserModel;
