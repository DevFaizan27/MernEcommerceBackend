import mongoose from "mongoose";
import 'dotenv/config'

export const connectToMongo=()=>{
    mongoose.connect(process.env.mongoDbURL).then(()=>{
        console.log('*|*|*|Database Connected Succesfully|*|*|*');
    }).catch((error)=>{
        console.log(error.message);
    })
}



// //login Controller
// export const loginUser=async(req,res)=>{
//     try{
//         res.send("Loggedin");
//     }catch(error){
//         console.log(error);
//     }
// }

