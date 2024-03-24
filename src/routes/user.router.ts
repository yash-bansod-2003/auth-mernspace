import express, { NextFunction, Response, Request } from "express";
import { UserController } from "@/controllers/user.controller";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/user";
import { AuthService } from "@/services/auth.service";
import authenticate from "@/middlewares/authenticate";
import { canAccess } from "@/middlewares/can-access";
import { UserRoles } from "@/constants";
import { userCreateValidator } from "@/lib/validators/user";
import { logger } from "@/config/logger";
import { UserCreateRequest, UserRequestWithParama } from "@/types";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const authService = new AuthService(userRepository);
const userController = new UserController(authService, logger);

router.post(
  "/user",
  userCreateValidator,
  authenticate,
  canAccess([UserRoles.ADMIN]),
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.create(req as UserCreateRequest, res, next);
  },
);

router.patch(
  "/user/:id",
  userCreateValidator,
  authenticate,
  canAccess([UserRoles.ADMIN]),
  async (req: Request, res: Response, next: NextFunction) => {
    await userController.update(req as UserRequestWithParama, res, next);
  },
);

export { router as userRouter };
