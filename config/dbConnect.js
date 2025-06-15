import mongoose from "mongoose";


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        return console.log("DB connected 😍");
    } catch (error) {
        return console.log('error', error);
    }
}

export default connectDB