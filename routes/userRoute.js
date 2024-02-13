import express from 'express';
import { resendOTP, signupUser, loginUser,verifyOtp,  resetPasswordOtp, updatePassword } from '../controllers/userController.js';
const router=express.Router();




//---------------------->>signup route<<------------------------------

//Signup route
router.post('/signup',signupUser);

//verify user email using  otp
router.post('/verify-otp',verifyOtp);

//resend-otp  at user email route
router.post('/resend-otp',resendOTP);




//------------------------>>login routes<<-----------------------------


//login route
router.post('/login',loginUser);

//sending  otp to reset password
router.post('/update-password-otp',resetPasswordOtp);

//reset password otp verify
router.post('/update-password',updatePassword);






export default router;