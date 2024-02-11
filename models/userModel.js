import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    otp: {
         type: String,
        required: true
     },
    isVerified: {
         type: Boolean,
         default: false }
},{
    timestamps:true
})

export const User=mongoose.model('User',userSchema)