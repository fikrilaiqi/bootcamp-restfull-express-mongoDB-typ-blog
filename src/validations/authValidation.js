import Joi from "joi";
import utils from "../utils/index.js";

const register = (req, res, next) => {
    const input = req.body;
    //validation input
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        fullname: Joi.string().min(8).required(),
    });
    return utils.validationInput(req, res, next, schema, input);
};

const login = (req, res, next) => {
    const input = req.body;
    //validation input
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    });
    return utils.validationInput(req, res, next, schema, input);
};

export default { register, login };
