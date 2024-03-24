import { Response, NextFunction } from "express";
import { UserCreateRequest } from "@/types";
import { AuthService } from "@/services/auth.service";
import { Logger } from "winston";
import { validationResult } from "express-validator";

class UserController {
  constructor(
    private userService: AuthService,
    private logger: Logger,
  ) {
    this.userService = userService;
    this.logger = logger;
  }

  async create(req: UserCreateRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, role } = req.body;

    this.logger.debug("new request to create a user", {
      firstName,
      lastName,
      email,
      role,
    });

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      this.logger.info("User has been registered", { id: user.id });

      return res.status(201).json({ id: user.id });
    } catch (error) {
      return next(error);
    }
  }
}

export { UserController };
