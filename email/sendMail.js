import nodemailer from 'nodemailer'
import 'dotenv/config';



export const sentEmail = async (mailOption) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: mailOption.email,
            subject: mailOption.subject,
            text: `Your OTP for email verification is: ${mailOption.otp}`
        };

        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};