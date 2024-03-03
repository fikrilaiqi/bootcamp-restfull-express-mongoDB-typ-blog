import { Schema, model } from "mongoose";

const usersSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        fullname: { type: String, required: true },
        image: String,
    },
    { timestamps: true }
);

export default model("user", usersSchema);
