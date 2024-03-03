import blogSchemas from "../schemas/blogSchemas.js";
import utils from "../utils/index.js";

const getAll = async (req, res) => {
    try {
        //find blog all and populate/join from ref
        const response = await blogSchemas
            .find({})
            .populate("author_id", "username image");

        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Get blog all Success!",
            data: response,
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { getAll };
