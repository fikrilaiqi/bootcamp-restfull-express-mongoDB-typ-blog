import blogsSchemas from "../schemas/blogsSchemas.js";
import utils from "../utils/index.js";

const getBlogAll = async (req, res) => {
    try {
        //find All Blog and populate/join from ref
        const response = await blogsSchemas
            .find({})
            .populate("author_id", "username image");

        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Get All blog Success!",
            data: response,
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { getBlogAll };
