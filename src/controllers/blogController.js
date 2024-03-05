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

const editById = async (req, res) => {
    try {
        const { id } = req.params;
        const input = req.body;
        const file = req.files;

        //if replace thumbnail , old_thumbnail filename required!
        if (file?.thumbnail && !input?.old_thumbnail) {
            return utils.handlerResponse(res, `BAD_REQUEST`, {
                message: "Found thumbnail file , old_thumbnail is required!",
            });
        }

        const existBlog = await blogSchema.findById(id);
        //if not found
        if (!existBlog) {
            return utils.handlerResponse(res, "NOT_FOUND", {
                message: "Blog Not Found!",
            });
        }

        //access authorId from authData
        const authorId = req.authData._id;
        //process upload file or replace file
        const { fileName, error: fileUploadError } = utils.processUploadFile(
            file?.thumbnail,
            input?.old_thumbnail
        );
        //if error upload file
        if (fileUploadError) {
            throw Error(fileUploadError);
        }
        //update object
        const updateBlogObj = {
            ...input,
            author_id: authorId,
            thumbnail: fileName,
            tags: input?.tags ? input?.tags.split(",") : "",
        };
        //update in database
        await blogSchema.findByIdAndUpdate(
            { _id: id },
            {
                $set: updateBlogObj,
            }
        );
        return utils.handlerResponse(res, "OK", {
            message: "Edit Blog Success!",
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

const deleteById = async (req, res) => {
    try {
        //put id from endpoint parameter
        const { id } = req.params;
        const existBlog = await blogSchema.findById(id);
        //if not found
        if (!existBlog) {
            return utils.handlerResponse(res, "NOT_FOUND", {
                message: "Blog Not Found!",
            });
        }
        //remove file thumbnail in upload folder
        utils.processUploadFile(false, existBlog?.thumbnail);
        //delete in database
        await blogSchema.deleteOne({ _id: id });
        return utils.handlerResponse(res, "OK", {
            message: "Delete Blog Success!",
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

const historyByAuthorId = async (req, res) => {
    try {
        const { authorId } = req.params;
        const response = await blogSchema
            .find({ author_id: authorId })
            .populate("author_id", "username image");
        return utils.handlerResponse(res, "OK", {
            message: "Get Blog History By Author Id Success!",
            data: response,
        });
    } catch (error) {
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default {
    getAll,
    create,
    getById,
    editById,
    deleteById,
    historyByAuthorId,
};
