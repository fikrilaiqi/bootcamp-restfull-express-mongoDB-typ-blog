import Joi from "joi";
import { validationInputHelper } from "../helpers/validationInputHelper.js";
const register = (req, res, next) => {
    const input = req.body;
    //validation input
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        fullname: Joi.string().min(8).required(),
    });
    return validationInputHelper(req, res, next, schema, input);
};

export default { register };
