import mongoose from "mongoose";
const connectDb = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/blog_typi");
        console.log("MongoDB Connected!");
    } catch (error) {
        console.log("Connect MongoDB Error", error);
    }
};

export default { connectDb };
