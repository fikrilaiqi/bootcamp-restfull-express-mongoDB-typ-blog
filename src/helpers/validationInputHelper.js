import { handlerResponseHelper } from "./handlerResponseHelper.js";

export const validationInputHelper = (req, res, next, joiSchema, input) => {
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
        return handlerResponseHelper(res, `BAD_REQUEST`, {
            message: `Validation Error : ${error}`,
        });
    }
};
