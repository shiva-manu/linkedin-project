import express from 'express';
import dotenv from "dotenv";
import authRoutes from './routes/auth.route.js';
dotenv.config();
const app=express();
const PORT=process.env.PORT || 5000;
app.use('/api/v1/auth',authRoutes);
app.listen(PORT,()=>{
   console.log(`Server running on port ${PORT}`);
});