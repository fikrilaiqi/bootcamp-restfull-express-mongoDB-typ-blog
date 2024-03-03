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

export default router;
