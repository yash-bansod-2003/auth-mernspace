import express from "express";
import { AuthController } from "@/controllers/auth.controller";
import { AuthService } from "@/services/auth.service";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/user";
import { logger } from "@/config/logger";
import { loginValidator, registerValidator } from "@/lib/validators/auth";
import { TokenService } from "@/services/token.service";
import { RefreshToken } from "@/entity/refresh-token";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const authService = new AuthService(userRepository);
const tokenService = new TokenService(refreshTokenRepository);
const authController = new AuthController(authService, tokenService, logger);

router.post(
  "/register",
  registerValidator,
  authController.register.bind(authController),
);

router.post(
  "/login",
  loginValidator,
  authController.login.bind(authController),
);

router.get("/self", authController.self.bind(authController));

export { router as authRouter };
