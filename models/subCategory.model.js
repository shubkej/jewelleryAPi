import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
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
    category: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "category"
        }
    ]
}, {
    timestamps: true
})

export const SubCategory = mongoose.model('subCategory', subCategorySchema)

