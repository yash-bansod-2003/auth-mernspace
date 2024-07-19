import { Request, Response, NextFunction } from "express";
import {
  UserCreateRequest,
  UserRequestWithParama,
  UserSearchQueryParams,
} from "@/types";
import { AuthService } from "@/services/auth.service";
import { Logger } from "winston";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";

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

    const { firstName, lastName, email, password, role, tenantId } = req.body;

    this.logger.debug("new request to create a user", {
      firstName,
      lastName,
      email,
      role,
      tenantId,
    });

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
      });

      this.logger.info("User has been registered", { id: user.id });

      return res.status(201).json({ id: user.id });
    } catch (error) {
      return next(error);
    }
  }

  async update(req: UserRequestWithParama, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    const userId = req.params.userId;

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (isNaN(Number(userId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    const { firstName, lastName, email, password, role } = req.body;

    this.logger.debug("new request to update a user", {
      firstName,
      lastName,
      email,
      role,
    });

    try {
      const user = await this.userService.update(Number(userId), {
        firstName,
        lastName,
        email,
        password,
        role,
      });

      this.logger.info("User has been registered", user);

      return res.json(user);
    } catch (error) {
      return next(error);
    }
  }

  async destroy(req: UserRequestWithParama, res: Response, next: NextFunction) {
    const userId = req.params.userId;

    if (isNaN(Number(userId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    this.logger.debug("new request to delete a user");

    try {
      const user = await this.userService.remove(Number(userId));

      this.logger.info("User has been registered", user);

      return res.json(user);
    } catch (error) {
      return next(error);
    }
  }

  async indexOne(
    req: UserRequestWithParama,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.params.userId;

    if (isNaN(Number(userId))) {
      next(createHttpError(400, "Invalid url param."));
      return;
    }

    this.logger.debug("new request to get a data of a single user");

    try {
      const user = await this.userService.me({ userId: Number(userId) });

      this.logger.info("User has been fetched", user);

      return res.json(user);
    } catch (error) {
      return next(error);
    }
  }

  async indexAll(req: Request, res: Response, next: NextFunction) {
    this.logger.debug("new request to get all users");
    const searchQueryParams = matchedData(req, {
      onlyValidData: true,
    }) as UserSearchQueryParams;
    const { page, limit } = searchQueryParams;
    try {
      const users = await this.userService.getAll(searchQueryParams);

      this.logger.info("all users are fetched");

      return res.json({
        page,
        limit,
        count: users[1],
        data: users[0],
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { UserController };
