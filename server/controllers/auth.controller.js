import User from "../models/user.module.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const signup=async(req,res)=>{
   try{
      const {name,username,email,password}=req.body
      const existingEmail=await User.findOne({email});
      if(!name || !username || !email || !password){
         res.status(400).json({message:"All fields are required"});
      }
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
      const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
      res.cookie('jwt-linkedin',token,{
         httpOnly:true, //prevent XSS attack
         maxAge:3*24*60*1000,
         sameSite:"strict",
         secure:process.env.NODE_ENV==="production",//prevents the man-middle attack
      });
      res.status(201).json({message:"User registered successfully"});
      const profileUrl=process.env.CLIENT_URL+"/profile/"+user.username
      //todo:send welcome email
      try{
         await sendWelcomeEmail(user.email,user.name,profileUrl);
      }catch(emailError){
         console.log("Error sending Welcome Email",emailError);
      }
   }catch(error){
      console.log("Error in signUp: ",error.message);
      res.status(500).json({message:"Internal server error"});
   }
}
export const login=(req,res)=>{
   res.send("Login")
}
export const logout=(req,res)=>{
   res.send("Logout")
}