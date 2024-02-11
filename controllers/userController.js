import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import { sentEmail } from "../email/sendMail.js";
import { generateOTP } from "../Functions/generateOtp.js";


//signup Controller
export const signupUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Field validation
        if (!email || !password) {
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
            email,
            password: hashedPassword,
            otp // Save OTP to user object
        });

        await newUser.save();

        return res.status(201).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

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

        return res.status(200).json({ message: "OTP resent successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
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

        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}





