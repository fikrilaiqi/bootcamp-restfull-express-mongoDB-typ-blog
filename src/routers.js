import { Router } from "express";
import authController from "./controllers/authController.js";
import authValidation from "./validations/authValidation.js";
import { checkAuthMidddleware } from "./middlewares/checkAuthMiddleware.js";
const router = Router();

//auth
router.post("/auth/register", authValidation.register, authController.register);
router.post("/auth/login", authValidation.login, authController.login);
router.get(
    "/auth/refresh-token",
    checkAuthMidddleware,
    authController.refreshToken
);

export default router;
