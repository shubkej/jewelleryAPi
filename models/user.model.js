import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    }, otp: {
        type: String,
    },
    otpExpiresAt: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    last_login_date: {
        type: Date,
        default: ""
    },
}, { timestamps: true })

export const User = mongoose.model('user', UserSchema)
