import bcrypt from "bcrypt";
import userSchema from "../schemas/userSchema.js";
import utils from "../utils/index.js";

const register = async (req, res) => {
    try {
        const input = req.body;
        //find user exist
        const existUser = await userSchema.findOne({
            username: input.username,
        });
        //if user found
        if (existUser) {
            return utils.handlerResponse(res, "BAD_REQUEST", {
                message: "User is exist, get to Login!",
            });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const createData = {
            ...input,
            password: hashedPassword,
        };

        //create user
        await userSchema.create(createData);
        //return response
        return utils.handlerResponse(res, "CREATED", {
            message: "Register Success!",
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { register };
