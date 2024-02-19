import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
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
     role: {
        type: String,
        default: "user",
        enum: [
            "admin",
            "employee",
            "manager",
            "user" // Add 'user' as a valid enum value
        ]
    },
    isVerified: {
         type: Boolean,
         default: false }
},{
    timestamps:true
})

export const User=mongoose.model('User',userSchema)