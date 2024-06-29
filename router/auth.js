const UserModel = require("../model/user.model");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;
    console.log({ username, email, password, role });
    try {
        bcrypt.hash(password, 8, async (error, hash) => {
            if (!error) {
                const user = new UserModel({ username, email, password: hash, role });
                await user.save();
                res.status(200).json({ "msg": "Registration Successful" });
            } else {
                res.status(400).json({ "msg": "Internal Server Error || Error in hashing password" });
            }
        });
    } catch (err) {
        res.status(500).json({ "msg": "Internal Server Error" });
    }
});
   

router.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await UserModel.findOne({email});
        console.log("user",user);
        if(user){
            bcrypt.compare(password,user.password,function(error,result){
                if(error){
                   res.status(400).send({"msg":"hashing error"});
                }
                else if(result){
                    const token = jwt.sign({ username: user.username, email: user.email, user_id: user._id,role:user.role}, process.env.SECRET_KEY);
                    res.status(200).send({"msg":"login successfully","token":token});
                }
                else{
                    res.status(400).send("wrong crediatials");
                }
            })
        }else{
            res.status(400).send({"msg":"first register"});
        }
    }catch(err){
        console.error(err);
        res.status(500).send({"msg:":"server side error "})
    }
})

module.exports = router;
