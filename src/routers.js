import { Router } from "express";
import authController from "./controllers/authController.js";
import authValidation from "./validations/authValidation.js";
import { checkAuthMidddleware } from "./middlewares/checkAuthMiddleware.js";
import blogController from "./controllers/blogController.js";
import blogValidation from "./validations/blogValidation.js";
const router = Router();

//auth
router.post("/auth/register", authValidation.register, authController.register);
router.post("/auth/login", authValidation.login, authController.login);
router.get(
    "/auth/refresh-token",
    checkAuthMidddleware,
    authController.refreshToken
);

//blog
router.get("/blog/all", blogController.getAll);
router.post(
    "/blog/create",
    checkAuthMidddleware,
    blogValidation.create,
    blogController.create
);

export default router;
