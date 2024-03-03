import bcrypt from "bcrypt";
import usersSchema from "../schemas/usersSchema.js";
import { handlerResponseHelper } from "../helpers/handlerResponseHelper.js";
const register = async (req, res) => {
    try {
        const input = req.body;
        //find user exist
        const existUser = await usersSchema.findOne({
            username: input.username,
        });
        //if user found
        if (existUser) {
            return handlerResponseHelper(res, "BAD_REQUEST", {
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
        await usersSchema.create(createData);
        //return response
        return handlerResponseHelper(res, "CREATED", {
            message: "Register Success!",
        });
    } catch (error) {
        //return response error
        return handlerResponseHelper(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { register };
