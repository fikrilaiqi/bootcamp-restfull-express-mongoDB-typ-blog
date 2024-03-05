import userSchema from "../schemas/userSchema.js";
import utils from "../utils/index.js";

const profile = async (req, res) => {
    try {
        //access userId from endpoint parameter
        const { userId } = req.params;
        //find one by userId and hide password
        const response = await userSchema.findOne({ _id: userId }, "-password");
        //if user not found
        if (!response) {
            return utils.handlerResponse(res, "NOT_FOUND", {
                message: "User Not Found!",
            });
        }
        return utils.handlerResponse(res, "OK", {
            message: "Get user by id Success!",
            data: response,
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

const editProfile = async (req, res) => {
    try {
        //access id from endpoint parameter
        const input = req.body;
        const file = req.files;
        //access authorId from authData
        const userId = req.authData._id;

        //find exit user
        const existUser = await userSchema.findById(userId);
        //if not found
        if (!existUser) {
            return utils.handlerResponse(res, "NOT_FOUND", {
                message: "Blog Not Found!",
            });
        }

        //if replace image , old_image filename required!
        if (existUser.toObject().image && !input?.old_image) {
            return utils.handlerResponse(res, `BAD_REQUEST`, {
                message: "Found image file , old_image is required!",
            });
        }
        //process upload file or replace file
        const { fileName, error: errFileUpload } = utils.processUploadFile(
            file?.image,
            input?.old_image
        );
        //if error upload file
        if (errFileUpload) {
            throw Error(errFileUpload);
        }

        const updateUserObj = { ...input, image: fileName };
        await userSchema.findByIdAndUpdate(
            { _id: userId },
            { $set: updateUserObj }
        );
        return utils.handlerResponse(res, "OK", {
            message: "Edit User Success!",
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};
export default { profile, editProfile };
