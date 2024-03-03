import dotenv from "dotenv";
const getEnv = (key = "") => {
    dotenv.config();
    return process.env[`${key}`];
};

const getHttpCodeResponse = (type = "") => {
    switch (type) {
        case "OK":
            return { code: 200, status: "success" };
        case "CREATED":
            return { code: 201, status: "success" };
        case "BAD_REQUEST":
            return { code: 400, status: "error" };
        case "UNAUTHORIZED":
            return { code: 401, status: "error" };
        case "INTERNAL_ERROR":
            return {
                code: 500,
                status: "error",
                message: "internal server error",
            };
        default:
            return {
                code: 500,
                status: "error",
                message: "internal server error",
            };
    }
};

const handlerResponse = (res, type = "", additionalData = {}) => {
    const httpCodeResponse = getHttpCodeResponse(type);
    return res
        .status(httpCodeResponse.code)
        .json({
            ...httpCodeResponse,
            ...additionalData,
        })
        .end();
};

export const validationInput = (req, res, next, joiSchema, input) => {
    try {
        if (!joiSchema || !input) {
            throw Error("schema and input is reqiured!");
        }
        const { error } = joiSchema.validate(input);
        //if error return status 400
        if (error) {
            throw Error(error.details.at(0).message);
        }
        next();
    } catch (error) {
        return handlerResponse(res, `BAD_REQUEST`, {
            message: `Validation Error : ${error}`,
        });
    }
};

export default { getEnv, handlerResponse, validationInput };
