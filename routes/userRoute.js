import express from 'express';
import { resendOTP, signupUser, verifyOtp } from '../controllers/userController.js';

const router=express.Router();

//Signup route
router.post('/signup',signupUser);

//verify otp
router.post('/verify-otp',verifyOtp);

//resend-otp -route
router.post('/resend-otp',resendOTP);

//signup route
// router.post('/login',loginUser);


export default router;