import Joi from "joi";
import utils from "../utils/index.js";

const editProfile = (req, res, next) => {
    const input = req.body;
    //validation input
    const schema = Joi.object({
        fullname: Joi.string(),
        old_image: Joi.string(),
        image: Joi.allow(),
    });
    return utils.validationInput(req, res, next, schema, input);
};

export default { editProfile };
