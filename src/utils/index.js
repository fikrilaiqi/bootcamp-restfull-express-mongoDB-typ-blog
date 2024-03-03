import dotenv from "dotenv";
const getEnv = (key = "") => {
    dotenv.config();
    return process.env[`${key}`];
};

export default { getEnv };
