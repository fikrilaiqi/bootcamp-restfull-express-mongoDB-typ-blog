import bcrypt from "bcrypt";
import usersSchema from "../schemas/usersSchema.js";
import utils from "../utils/index.js";

const register = async (req, res) => {
    try {
        const input = req.body;
        //find user exist
        const existUser = await usersSchema.findOne({
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
        await usersSchema.create(createData);
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

const login = async (req, res) => {
    try {
        const input = req.body;

        //find user exist
        const existUser = await usersSchema.findOne({
            username: input.username,
        });
        //if user not found
        if (!existUser) {
            return utils.handlerResponse(res, "NOT_FOUND", {
                message: "User Not Found!",
            });
        }
        //convert toObject() to access value
        const { password: passUser, _id, ...rest } = existUser.toObject();
        //compare password in database with input password
        const isValid = await bcrypt.compare(input.password, passUser);
        if (!isValid) {
            return utils.handlerResponse(res, "BAD_REQUEST", {
                message: "Invalid Password!",
            });
        }

        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Login Success!",
            data: {
                token: utils.createToken({ _id: existUser._id, ...rest }),
            },
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { _id, ...rest } = req.authData;
        //find user exist and hide password
        const existUser = await usersSchema.findOne({ _id }, "-password");
        //if user not found
        if (!existUser) {
            return utils.handlerResponse(res, "NOT_FOUND", {
                message: "User Not Found!",
            });
        }
        //return response
        return utils.handlerResponse(res, "OK", {
            message: "Refresh Token Success!",
            data: {
                token: utils.createToken({
                    _id: existUser._id,
                    ...existUser.toObject(),
                }),
            },
        });
    } catch (error) {
        //return response error
        return utils.handlerResponse(res, "INTERNAL_ERROR", {
            message: error.message || error,
        });
    }
};

export default { register, login, refreshToken };
