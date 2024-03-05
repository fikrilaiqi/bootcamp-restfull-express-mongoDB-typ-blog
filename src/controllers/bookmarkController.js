import blogSchema from "../schemas/blogSchema.js";
import bookmarkSchema from "../schemas/bookmarkSchema.js";
import utils from "../utils/index.js";

const create = async (req, res) => {
    try {
        const { blog_id } = req.body;
        //access userId from authData
        const userId = req.authData._id;
        //find exits bookmark
        const existBookmark = await bookmarkSchema.findOne({
            user_id: userId,
            blog_id,
        });
        //if exist bookmark
        if (existBookmark) {
            return utils.handlerResponse(res, `BAD_REQUEST`, {
                message: "Already Bookmark!",
            });
        }
        //find blog
        const blog = await blogSchema.findById(blog_id);
        //id author and userid same
        if (blog?.author_id?.toString() === userId) {
            return utils.handlerResponse(res, `BAD_REQUEST`, {
                message: "Author Not Allow Bookmark!",
            });
        }
        //insert in database
        await bookmarkSchema.create({
            user_id: userId,
            blog_id,
        });
        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Create Bookmark Blog Success!",
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { create };
