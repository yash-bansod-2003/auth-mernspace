import express from "express";
import { AuthController } from "@/controllers/auth.controller";
import { AuthService } from "@/services/auth.service";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/user";
import { logger } from "@/config/logger";
import { registerValidator } from "@/lib/validators/auth";
import { TokenService } from "@/services/token.service";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const authService = new AuthService(userRepository);
const tokenService = new TokenService();
const authController = new AuthController(authService, tokenService, logger);

router.post(
  "/register",
  registerValidator,
  authController.register.bind(authController),
);

export { router as authRouter };
