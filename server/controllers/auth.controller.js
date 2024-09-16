import User from "../models/user.module.js";
import bcrypt from 'bcryptjs';
export const signup=async(req,res)=>{
   try{
      const {name,username,email,password}=req.body
      const existingEmail=await User.findOne({email});
      if(existingEmail){
         return res.status(400).json({message:"Email already exist"});
      }
      const existingUsername=await User.findOne({username});
      if(existingUsername){
         return res.status(400).json({message:"Username already exists"});
      }
      if(password.length<6){
         return res.status(400).json({message:"Password must be at least 6 characters"});
      }
      //hashing the password...
      const salt=await bcrypt.genSalt(10);
      const hashedPassword=await bcrypt.hash(password,salt);
      const user=new User({
         name,
         email,
         password:hashedPassword,
         username
      });
      await user.save();
   }catch(error){

   }
}
export const login=(req,res)=>{
   res.send("Login")
}
export const logout=(req,res)=>{
   res.send("Logout")
}