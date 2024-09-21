import cloudinary from '../lib/cloudinary.js';
import Post from '../models/post.model.js';
import Notification from '../models/notification.model.js';
export const getFeedPosts=async(req,res)=>{
   try{
      const posts=await Post.find({author:{$in:req.user.connections}}).populate("author","name username profilePicture headline").populate("comments.user","name profilePicture").sort({createdAt:-1});
      res.status(200).json(posts);
   }catch(error){
      console.error("Error in getFeedPosts controller:",error);
      res.status(500).json({message:"Server errro"});
   }
}

export const createPost=async(req,res)=>{
   try{
      const {content,image}=req.body;
      let newPost;
      if(image){
      const imgResult=await cloudinary.uploader.upload(image);
      newPost=new Post({
         author:req.user._id,
         content,
         image:imgResult.secure_url,
      })
   }
      else{
         newPost=new Post({
            author:req.user._id,
            content,
         })
      }
      await newPost.save();
      res.status(201).json(newPost);
   }catch(error){
      console.log("Error in createdPost controller: ",error);
      res.status(500).json({message:"Server error"});
   }
}
export const deletePost=async(req,res)=>{
   try{
      const postId=req.params.id;
      const userId=req.user._id;
      const post=await Post.findById(postId);
      if(!post){
         return res.status(404).json({message:"Post not found"});
      }
      if(post.author.toString()!==userId.toString()){
         return res.status(403).json({message:"You are not authorized to delete this post"});
      }
      if(post.image){
         //todo: do this later
         //https://res.cloudinary.com/dvdhufgyr/image/upload/vsdgcfvg/uishdvb.png.
         await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0])
      }
      await Post.findByIdAndDelete(postId);
      res.status(200).json({message:"Post deleted successfully"});
   }catch(error){
      console.log("Error in deletePost controller",error.message);
      res.status(500).json({message:"Server error"});
   }
}

export const getPostById=async(req,res)=>{
   try{
      const postId=req.params.id;
      const post=await Post.findById(postId).populate("author","name username profilePicture headline").populate("comments.user","name profilePicture username headline");
      res.status(200).json(post);
   }catch(error){
      console.log("Error in getPostById controller:",error);
      res.status(500).json({message:"Server error"});
   }
}

export const createComment=async(req,res)=>{
   try{
      const postId=req.user._id;
      const {content}=req.body;
      const post=await Post.findByIdAndUpdate(postId,{
         $push:{comments:{user:req.user._id,content}},
      }).populate("author","name email username headline profilePicture");
      //create a notification if the comment owner is not the post owner
      if(post.author.toString()!==req.user._id.toString()){
         const newNotification=new Notification({
            recipient:post.author,
            type:"comment",
            relatedUser:req.user._id,
            relatedPost:postId
         })
         await newNotification.save();
         try{
            const postUrl=process.env.CLIENT_URL+"/post"+postId;
            await sendCommentNotificationEmail(post.author.email,post.author.name,req.user.name,postUrl,content)
         }catch(error){
            console.log("Error in sending comment notification email",error);
         }
         res.status(200).json(post);
      }
   }catch(error){
      console.log("Error in createComment controller:",error);
      res.status(500).json({message:"Server error"});
   }
}

export const likePost=(req,res)=>{
   try{
      
   }catch(error){

   }
}