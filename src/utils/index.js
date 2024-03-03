import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs";

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
        case "NOT_FOUND":
            return { code: 404, status: "error" };
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

const createToken = (payload = {}) => {
    const secret = getEnv("JWT_SECRET");
    return jwt.sign(payload, secret, {
        expiresIn: "24h",
    });
};

const toUploadFile = (file) => {
    //initial result
    let result = { fileName: null };
    try {
        //if file upload empty
        if (!file) return { ...result, error: "Not found file upload!" };
        //access origin name
        const originName = file.name;
        //create unix timestamp
        const unixTimestamp = Math.round(Date.now());
        //combain origin name and unix timestamp
        const rename = `${unixTimestamp}-${originName}`;
        //create file from upload and rename file
        fs.writeFileSync(`./upload/${rename}`, file.data);
        return { ...result, fileName: rename };
    } catch (error) {
        //return error
        return { ...result, error: error.message };
    }
};

const processUploadFile = (file, oldFileName) => {
    //initial result
    let result = { fileName: null };
    try {
        //if oldFileName found
        if (oldFileName) {
            //remove oldfile uploaded in folder upload
            fs.unlinkSync(`./upload/${oldFileName}`);
        }
        //if file found
        if (file) {
            //procees upload file
            result = toUploadFile(file);
        }
        return result;
    } catch (error) {
        //return error
        return { ...result, error: error.message };
    }
};

export default {
    getEnv,
    handlerResponse,
    validationInput,
    createToken,
    processUploadFile,
};
