import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerController, loginController, refreshController, logoutController } from "../controllers/auth.js";
import Joi from "joi";

const router = Router();

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(64).trim().required(),
  email: Joi.string().email().min(3).max(254).trim().required(),
  password: Joi.string().min(6).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().min(3).max(254).trim().required(),
  password: Joi.string().min(6).max(128).required(),
});

router.post("/register", validateBody(registerSchema), ctrlWrapper(registerController));
router.post("/login", validateBody(loginSchema), ctrlWrapper(loginController));
router.post("/refresh", ctrlWrapper(refreshController));
router.post("/logout", ctrlWrapper(logoutController));

export default router;
