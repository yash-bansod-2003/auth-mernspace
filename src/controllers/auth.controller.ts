import { AuthService } from "@/services/auth.service";
import { Request, Response, NextFunction } from "express";
import { UserData } from "@/types";
import { Logger } from "winston";

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

      this.logger.debug("new request to create a user", {
        firstName,
        lastName,
        email,
      });

      const user = await this.authService.create({
        firstName,
        lastName,
        email,
        password,
      });

      this.logger.info("User has been registered", { id: user.id });

      return res.status(201).json({ id: user.id });
    } catch (error) {
      return next(error);
    }
  }
}

export { AuthController };
