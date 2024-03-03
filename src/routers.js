import { Router } from "express";
import authsController from "./controllers/authsController.js";
import authsValidation from "./validations/authsValidation.js";
const router = Router();

//auth
router.post(
    "/auth/register",
    authsValidation.register,
    authsController.register
);
router.post("/auth/login", authsValidation.login, authsController.login);

export default router;
