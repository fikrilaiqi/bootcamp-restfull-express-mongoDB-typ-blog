import { Schema, model } from "mongoose";

const blogSchema = new Schema(
    {
        content: { type: String, required: true },
        tags: { type: [String] },
        author_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
        title: { type: String, required: true },
        thumbnail: { type: String },
    },
    { timestamps: true }
);

export default model("blog", blogSchema);
