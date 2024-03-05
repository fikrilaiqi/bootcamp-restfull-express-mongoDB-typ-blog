import blogSchema from "../schemas/blogSchema.js";
import utils from "../utils/index.js";

const getAll = async (req, res) => {
    try {
        //find blog all and populate/join from ref
        const response = await blogSchema
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

const create = async (req, res) => {
    try {
        const input = req.body;
        const file = req.files;

        //process upload file
        const { fileName, error: errFileUpload } = utils.processUploadFile(
            file?.thumbnail
        );
        //if error upload file
        if (errFileUpload) {
            throw Error(errFileUpload);
        }
        //access authorId from authData
        const authorId = req.authData._id;
        //create Object
        const createBlogObj = {
            ...input,
            author_id: authorId,
            thumbnail: fileName,
            tags: input?.tags ? input?.tags.split(",") : "",
        };
        //insert database
        const response = await blogSchema.create(createBlogObj);
        //return response
        return utils.handlerResponse(res, "CREATED", {
            message: "Blog created Success!",
            data: response,
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

const getById = async (req, res) => {
    try {
        //put id from endpoint parameter
        const { id } = req.params;
        //check exit blog
        const existBlog = await blogSchema
            .findOne({ _id: id })
            .populate("author_id", "username image");
        //if not found
        if (!existBlog) {
            return utils.handlerResponse(res, "NOT_FOUND", {
                message: "Blog Not Found!",
            });
        }
        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Get Blog by Id Success!",
            data: existBlog.toObject(),
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { getAll, create, getById };
