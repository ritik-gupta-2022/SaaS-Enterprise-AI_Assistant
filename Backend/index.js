import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';  // package for extracting cokie from browser
import authRoutes from './routes/auth.routes.js';
import businessRoutes from './routes/business.route.js'
import marketingRoutes from './routes/email.route.js'
// This line loads environment variables from the .env file into process.env
dotenv.config()
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());

// mongo url
mongoose.connect(process.env.MONGO)
.then(()=>console.log("mongoDB connected"))
.catch((err)=>console.log(err))






app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/marketing", marketingRoutes);



app.get('/',(req,res)=>{
    res.send('hello world');
    console.log("hii");
})

//this middleware will be called when an error is tackled , this is to increase code reusability, global error handler

app.use((err, req, res, next)=>{
    const statusCode = err.StatusCode || 500;
    const message = err.message || 'Internal Server error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})
app.listen(3000,()=>{
    console.log("server connected at port 3000");
});
