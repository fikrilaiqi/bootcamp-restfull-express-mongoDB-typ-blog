import bookmarkSchema from "../schemas/bookmarkSchema";
import utils from "../utils/index.js";

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
            message: "Get History by blog id Success!",
            data: response,
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { historyUserByBlogId };
