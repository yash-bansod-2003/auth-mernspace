import { AuthService } from "@/services/auth.service";
import { Request, Response, NextFunction } from "express";
import { UserData } from "@/types";
import { Logger } from "winston";
import createHttpError from "http-errors";

interface AuthRegisterRequest extends Request {
  body: UserData;
}

class AuthController {
  constructor(
    private authService: AuthService,
    private logger: Logger,
  ) {
    this.authService = authService;
  }

  async register(req: AuthRegisterRequest, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, password } = req.body;

      this.logger.info(firstName);

      const user = await this.authService.create({
        firstName,
        lastName,
        email,
        password,
      });

      if (!user) {
        return next(createHttpError(500, "user not created"));
      }

      this.logger.info(user);

      return res.status(201).json(user);
    } catch (error) {
      return next(error);
    }
  }
}

export { AuthController };
