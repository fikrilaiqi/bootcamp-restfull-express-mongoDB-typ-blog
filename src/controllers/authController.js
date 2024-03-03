import bcrypt from "bcrypt";
import usersSchema from "../schemas/usersSchema.js";
const login = async (req, res) => {
    try {
        const input = req.body;
        //find user exist
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
};

export default { login };
