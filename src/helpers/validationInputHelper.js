export const validationInputHelper = (req, res, next, joiSchema, input) => {
    try {
        if (!schema || !input) {
            throw Error("schema and input is reqiured");
        }
        const { error } = joiSchema.validate(input);
        //if error return status 400
        if (error) {
            return res
                .status(400)
                .json({
                    status: "error",
                    message: error.details.at(0).message,
                    code: 400,
                })
                .end();
        }
        next();
    } catch (error) {
        return res
            .status(400)
            .json({
                status: "error",
                message: `Validation Error : ${error}`,
                code: 400,
            })
            .end();
    }
};
