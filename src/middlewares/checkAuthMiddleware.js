import jwt from "jsonwebtoken";
import utils from "../utils/index.js";

export const checkAuthMidddleware = (req, res, next) => {
    try {
        //put token in header Authorization :  "Bearer <token>"
        const authHeader = req.header("Authorization") || "";
        //put only token
        const token = authHeader && authHeader.split(" ").at(1);
        //if token empty
        if (!token) throw Error("Access Denied!");
        //veryfy token with secret
        const verified = jwt.verify(token, utils.getEnv("JWT_SECRET"));
        //if not verified
        if (!verified) throw Error("Invalid Token!");
        //save data to req.authData
        req.authData = verified;
        //next process
        next();
    } catch (error) {
        //error handler
        return utils.handlerResponse(res, "UNAUTHORIZED", {
            message: error.message || "Expired Token!",
        });
    }
};
