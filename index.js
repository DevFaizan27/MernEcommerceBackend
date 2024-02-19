import express from "express";
import 'dotenv/config';
import { connectToMongo } from "./database/db.js";
import userRoute from './routes/userRoute.js';
import productRote from './routes/productRoute.js'
import cors from 'cors'
import deleteUnverifiedUsersPeriodically from "./middleware/deleteunverifiedUser.js";

const app=express();

app.use(express.json())

//middleware to handle cors policy
app.use(cors())

//delete unverified user middleware
deleteUnverifiedUsersPeriodically();


//connecting database 
connectToMongo()

// Available routes
app.get('/',(req,res)=>{
    return res.status(200).send("Hello World!");
});

app.use('/api/user',userRoute);
app.use('/api/product',productRote);


app.listen(process.env.PORT,()=>{
    console.log(`App is running on Port ${process.env.PORT}`);
})