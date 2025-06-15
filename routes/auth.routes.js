import { Router } from "express";
import { forgetPassword, login, register, resendOtp, resetPassword, verifyOtp } from "../controllers/auth.js";


const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/verify-otp', verifyOtp)
router.post('/resendOtp', resendOtp)
router.post('/forget-password',forgetPassword )
router.post('/resetPassword', resetPassword)

export default router