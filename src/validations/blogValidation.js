import Joi from "joi";
import utils from "../utils/index.js";

const create = (req, res, next) => {
    const input = req.body;
    //validation input
    const schema = Joi.object({
        content: Joi.string().required(),
        tags: Joi.string(),
        title: Joi.string().required(),
        thumbnail: Joi.allow(),
    });
    return utils.validationInput(req, res, next, schema, input);
};

const editById = (req, res, next) => {
    const input = req.body;
    //validation input
    const schema = Joi.object({
        content: Joi.string(),
        tags: Joi.string(),
        title: Joi.string(),
        old_thumbnail: Joi.string(),
        thumbnail: Joi.allow(),
    });
    return utils.validationInput(req, res, next, schema, input);
};

export default { create, editById };
