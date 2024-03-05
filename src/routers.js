import { Router } from "express";
import authController from "./controllers/authController.js";
import authValidation from "./validations/authValidation.js";
import { checkAuthMidddleware } from "./middlewares/checkAuthMiddleware.js";
import blogController from "./controllers/blogController.js";
import blogValidation from "./validations/blogValidation.js";
import bookmarkController from "./controllers/bookmarkController.js";
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
router.get("/blog/:id", blogController.getById);
router.patch(
    "/blog/edit/:id",
    checkAuthMidddleware,
    blogValidation.editById,
    blogController.editById
);
router.delete(
    "/blog/delete/:id",
    checkAuthMidddleware,
    blogController.deleteById
);
router.get("/blog/history/:authorId", blogController.historyByAuthorId);

//bookmark
router.post(
    "/bookmark/create",
    checkAuthMidddleware,
    bookmarkController.create
);

router.get(
    "/bookmark/history-user/:blogId",
    checkAuthMidddleware,
    bookmarkController.historyUserByBlogId
);

export default router;
