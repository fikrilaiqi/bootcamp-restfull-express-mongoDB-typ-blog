import { Schema, model } from "mongoose";

const bookmakSchema = new Schema(
    {
        blog_id: { type: Schema.Types.ObjectId, ref: "blog", required: true },
        user_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
    },
    { timestamps: true }
);

export default model("bookmark", bookmakSchema);
