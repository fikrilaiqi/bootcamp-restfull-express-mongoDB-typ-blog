import { Router } from "express";
import authsController from "./controllers/authsController.js";
import authsValidation from "./validations/authsValidation.js";
import { checkAuthMidddleware } from "./middlewares/checkAuthMiddleware.js";
import blogsController from "./controllers/blogsController.js";
const router = Router();

//auth
router.post(
    "/auth/register",
    authsValidation.register,
    authsController.register
);
router.post("/auth/login", authsValidation.login, authsController.login);
router.get(
    "/auth/refresh-token",
    checkAuthMidddleware,
    authsController.refreshToken
);

//blog
router.get("/blog/all", blogsController.getBlogAll);

export default router;
