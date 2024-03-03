import { Router } from "express";
import authController from "./controllers/authController.js";
import authValidation from "./validations/authValidation.js";
const router = Router();

//auth
router.post("/auth/register", authValidation.register, authController.register);
router.post("/auth/login", authValidation.login, authController.login);

export default router;
