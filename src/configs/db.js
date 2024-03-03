import mongoose from "mongoose";
import utils from "../utils/index.js";
const connectDb = async () => {
    try {
        await mongoose.connect(utils.getEnv("MONGODB_URL"));
        console.log("MongoDB Connected!");
    } catch (error) {
        console.log("Connect MongoDB Error", error);
    }
};

export default { connectDb };
