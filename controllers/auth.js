import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import sendEmail from '../utils/mailer.js';
import verifyEmailTemplate from '../utils/verifyEmailTemplete.js'
import forgetPasswordOtp from '../utils/forgetPasswordOtp.js'
import resendOtpTemplate from "../utils/resendOtpTemplate.js";


export const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, message: "Invalid input" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            otp,
            otpExpiresAt,
        });

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: "Verify email from APiPractice",
            html: verifyEmailTemplate({
                name: firstName,
                otp: otp
            })
        })

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please verify your email with the OTP.",
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ success: false, message: "Registration failed" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Invalid input" });
        }

        const userFound = await User.findOne({ email });

        if (!userFound) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, userFound.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (!userFound.isVerified) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            userFound.otp = otp;
            userFound.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await userFound.save();

            const verifyEmail = await sendEmail({
                sendTo: email,
                subject: "Verify email from APiPractice",
                html: verifyEmailTemplate({
                    name: userFound.firstName,
                    otp: otp
                })
            })

            return res.status(403).json({
                success: false,
                message: "Account not verified. OTP sent to email & valid for 10 minutes.",
            });
        }


        const token = jwt.sign({ id: userFound.id }, "SECRET_KEY_SHUBHAM", { expiresIn: "1d" });

        const updateUser = await User.findByIdAndUpdate(userFound?._id, {
            last_login_date: new Date()
        })

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        res.cookie('accessToken', token, cookiesOption)
        res.status(200)
            .json({
                token,
                success: true,
                message: "User logged in successfully",
            });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: "Login failed" });
    }
};

export const resendOtp = async (req, res) => {
    const { email} = req.body;

    try {
        const userFound = await User.findOne({ email });

        if (!userFound) {
            return res.status(404).json({ success: false, message: "user not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        userFound.otp = otp;
        userFound.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await userFound.save();

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: "Verify email from APiPractice",
            html: resendOtpTemplate({
                name: userFound.firstName,
                otp: otp
            })
        })

        return res.status(200).json({ success: true, message: "otp send to email" });
    } catch (error) {
        console.error('OTP verification error:', error);
        return res.status(500).json({ success: false, message: "OTP verification failed" });
    }
};
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !user.otp || user.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (user.otpExpiresAt < new Date()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }



        user.isVerified = true;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        return res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        console.error('OTP verification error:', error);
        return res.status(500).json({ success: false, message: "OTP verification failed" });
    }
};

export const forgetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid user" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        userFound.otp = otp;
        userFound.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await userFound.save();

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: "Verify email from APiPractice",
            html: forgetPasswordOtp({
                name: user.firstName,
                otp: otp
            })
        })

        return res.status(200).json({ success: true, message: "otp verifed successfully" });
    } catch (error) {
        console.error('OTP verification error:', error);
        return res.status(500).json({ success: false, message: "OTP verification failed" });
    }
};

export const resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    try {
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: "provide required fields email, newPassword, confirmPassword" });
        }

        const userFound = await User.findOne({ email });

        if (!userFound) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "newPassword and confirmPassword must be same.",
                error: true,
                success: false,
            })
        }

        const hashPassword = await bcrypt.hash(newPassword, 12);

        await User.findByIdAndUpdate(userFound._id, {
            password: hashPassword
        })

        return response.json({
            message: "Password updated successfully.",
            error: false,
            success: true
        })

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: "Login failed" });
    }
};




