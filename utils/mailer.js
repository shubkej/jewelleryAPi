import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: sendTo,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: 'Email sent successfully',
        };
    } catch (error) {
        console.error(`❌ Failed to send email to ${sendTo}:`, error);
        throw new Error('Failed to send email. Please try again later.');
    }
};
export default sendEmail

