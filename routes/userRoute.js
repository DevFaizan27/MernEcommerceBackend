import express from 'express';
import { resendOTP, signupUser, loginUser,verifyOtp,  resetPasswordOtp, updatePassword } from '../controllers/userController.js';

const router=express.Router();

//Signup route
router.post('/signup',signupUser);

//login route
router.post('/login',loginUser);

//reset password or forgot password
router.post('/update-password-otp',resetPasswordOtp);

//reset password otp verify
router.post('/update-password',updatePassword)

//verify user email using  otp
router.post('/verify-otp',verifyOtp);

//resend-otp  at user email route
router.post('/resend-otp',resendOTP);





export default router;