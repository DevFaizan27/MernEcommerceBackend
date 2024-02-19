import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { sentEmail } from "../email/sendMail.js";
import { generateOTP } from "../Functions/generateOtp.js";




//--------------------->>controller for signup<<-----------------------

//signup Controller
export const signupUser = async (req, res) => {
    const {name, email, password,role } = req.body;

    try {
        // Field validation
        if (!name||!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Email validation
        if (!email.includes('@')) {
            return res.status(400).json({ error: "Please enter a valid email" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Generate OTP
        const otp = generateOTP();

        // Send OTP via email
        const mailOptions={
            email,
            otp,
            subject:'Email Otp verification'
        }
        await sentEmail(mailOptions);

        // Hashing password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user without saving
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            otp ,// Save OTP to user object
            role,
            createdAt: new Date() 
        });

        await newUser.save();


        return res.status(201).json({ success: "OTP sent successfully" });
    } catch (error) {
        return res.status(500).send("Internal server error");
    }
};


//route to verify email
export const verifyOtp=async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if OTP matches
        if (user.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Mark the user as verified
        user.isVerified = true;
        await user.save();

        return res.status(200).json({ success: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
}


// controller to resend OTP for an existing user
export const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate new OTP
        const otp = generateOTP();

        // Update OTP in the user document
        user.otp = otp;
        await user.save();

        // Send OTP via email
        const mailOptions = {
            email,
            otp,
            subject: 'Email OTP verification'
        };
        await sentEmail(mailOptions);

        return res.status(200).json({ success: "OTP resent successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};




//--------------------->>controller for logins<<-----------------------

//login Controller
export const loginUser=async(req,res)=>{
    const{email,password}=req.body;
    try{
         //empty Field validation
         if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Email validation
        if (!email.includes('@')) {
            return res.status(400).json({ error: "Please enter a valid email" });
        }

        //finding user
        const user=await User.findOne({email});
        //validating user exist with that email
        if(!user){
            return res.status(400).json({error:"User not Found"});
        }

        //matching user password to de-hash password with bcrypt.compare()
        const doMatch=await bcrypt.compare(password,user.password);

        //is email verified or not
        const verifiedEmail=await(user.isVerified)
        console.log(verifiedEmail)

        if(doMatch&&verifiedEmail){
            const token=jwt.sign({userId:user.id},process.env.JWT_SECRET,{
                expiresIn:'7d'
            })
            res.status(201).json({ success: "logged in  successfully",token})
        }else{
            res.status(400).json({error:'Either Email or password are wrong'})
        }
    }catch(error){
        console.log(error);
        return res.status(500).send("Internal Server Error")
    }
}


// Controller for sending  OTP to reset password
 export const resetPasswordOtp = async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Generate new OTP
        const otp = generateOTP();

        // Update OTP in the user document
        user.otp = otp;
        await user.save();

        // Send OTP via email
        const mailOptions = {
            email,
            otp,
            subject: 'Forgot Password OTP'
        };
        await sentEmail(mailOptions);

        return res.status(200).json({ success: "OTP sent successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};


//Controller for updating password after OTP verification
export const updatePassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Validate OTP
        if (user.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Update password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        // Clear OTP after password update
        // user.otp = undefined;
        await user.save();

        return res.status(200).json({ success: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};