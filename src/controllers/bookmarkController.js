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

const historyUserByBlogId = async (req, res) => {
    try {
        //access BlogId from endpoint parameter
        const { blogId } = req.params;
        //access authorId from authData
        const userId = req.authData;
        //find in database
        const response = await bookmarkSchema.findOne({
            blog_id: blogId,
            user_id: userId,
        });

        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Get History user by blog id Success!",
            data: { count: response ? 1 : 0 },
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

const historyByUserId = async (req, res) => {
    try {
        //access userId from endpoint parameter
        const { userId } = req.params;
        //find bookmark by userId
        const response = await bookmarkSchema.find({ user_id: userId });

        //get All UserId and save in array
        const blogIds = [];
        for (let i = 0; i < response?.length; i++) {
            const { blog_id } = response[i];
            blogIds.push(blog_id);
        }

        //find blog by blogIds and populate author_id
        const getBlogs = await blogSchema
            .find({ _id: { $in: blogIds } })
            .populate("author_id", "username image");
        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Get History by user id Success!",
            data: getBlogs,
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { create, historyUserByBlogId, historyByUserId };
