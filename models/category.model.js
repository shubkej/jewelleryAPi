import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
}, { timestamps: true });

export const Category = mongoose.model('category', CategorySchema);
