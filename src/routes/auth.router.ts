import express, { NextFunction, Request, Response } from "express";
import { AuthController, AuthSelfRequest } from "@/controllers/auth.controller";
import { AuthService } from "@/services/auth.service";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/user";
import { logger } from "@/config/logger";
import { loginValidator, registerValidator } from "@/lib/validators/auth";
import { TokenService } from "@/services/token.service";
import { RefreshToken } from "@/entity/refresh-token";
import authenticate from "@/middlewares/authenticate";
import validateRefreshToken from "@/middlewares/validateRefreshToken";
import parseRefreshToken from "@/middlewares/parseRefreshToken";

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

router.get(
  "/self",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    await authController.self(req as AuthSelfRequest, res, next);
  },
);

router.post(
  "/refresh",
  validateRefreshToken,
  async (req: Request, res: Response, next: NextFunction) => {
    await authController.refresh(req as AuthSelfRequest, res, next);
  },
);

router.post(
  "/logout",
  authenticate,
  parseRefreshToken,
  async (req: Request, res: Response, next: NextFunction) => {
    await authController.logout(req as AuthSelfRequest, res, next);
  },
);

export { router as authRouter };
