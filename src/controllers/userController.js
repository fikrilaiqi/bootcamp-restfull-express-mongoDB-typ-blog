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

export default { profile };
