import mongoose, { Schema } from 'mongoose'

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // image: {
    //     type: String,
    //     required: true
    // },
    image: {
        type: [String],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category', 
        required: true
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'subCategory', 
        required: true
    }
}, { timestamps: true });

export const Product = mongoose.model('product', ProductSchema)