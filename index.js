import express from "express";
import 'dotenv/config';
import { connectToMongo } from "./database/db.js";
import userRoute from './routes/userRoute.js';
import cors from 'cors'

const app=express();

app.use(express.json())

//middleware to handle cors policy
app.use(cors())

//connecting database 
connectToMongo()

// Available routes
app.get('/',(req,res)=>{
    return res.status(200).send("Hello World!");
});

app.use('/api/user',userRoute);


app.listen(process.env.PORT,()=>{
    console.log(`App is running on Port ${process.env.PORT}`);
})