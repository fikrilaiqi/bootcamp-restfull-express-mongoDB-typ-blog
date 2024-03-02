import { Router } from "express";
import bcrypt from "bcrypt";
import Joi from "joi";
import usersSchema from "./schemas/usersSchema.js";
const router = Router();

//auth
router.post(
    "/auth/register",
    (req, res, next) => {
        try {
            const input = req.body;
            //validation input
            const schema = Joi.object({
                username: Joi.string().min(6).required(),
                password: Joi.string().min(6).required(),
                fullname: Joi.string().min(8).required(),
            });

            const { error } = schema.validate(input);
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
    },
    async (req, res) => {
        try {
            const input = req.body;

            //find user exist,  hide password and timestamp
            const existUser = await usersSchema.findOne({
                username: input.username,
            });
            //if user found
            if (existUser) {
                return res.status(400).json({
                    status: "error",
                    message: "User is exist, get to Login!",
                    code: 400,
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
            return res.status(201).json({
                status: "success",
                message: "Register Success!",
                code: 201,
            });
        } catch (error) {
            //return response error
            return res
                .status(500)
                .json({
                    status: "error",
                    message: error?.message || error || "internal server error",
                    code: 500,
                })
                .end();
        }
    }
);

export default router;
