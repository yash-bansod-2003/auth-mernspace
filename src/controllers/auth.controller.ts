import { AuthService } from "@/services/auth.service";
import { Request, Response, NextFunction } from "express";
import { UserData, AuthenticatedRequest } from "@/types";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import Jwt from "jsonwebtoken";
import { TokenService } from "@/services/token.service";
import createHttpError from "http-errors";

interface AuthRegisterRequest extends Request {
  body: UserData;
}

interface AuthLoginRequest extends Request {
  body: Pick<UserData, "email" | "password">;
}

class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private logger: Logger,
  ) {
    this.authService = authService;
    this.tokenService = tokenService;
  }

  async register(req: AuthRegisterRequest, res: Response, next: NextFunction) {
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
      const user = await this.authService.create({
        firstName,
        lastName,
        email,
        password,
        role,
      });

      this.logger.info("User has been registered", { id: user.id });

      const payload: Jwt.JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken(
        payload,
        newRefreshToken.id,
      );

      // Set the "Secure" flag on the cookie if the connection is https
      const secureCookie =
        req.secure || req.headers["x-forwarded-proto"] === "https";

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
        secure: secureCookie,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365,
        secure: secureCookie,
      });

      return res.status(201).json({ id: user.id });
    } catch (error) {
      return next(error);
    }
  }

  async login(req: AuthLoginRequest, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    this.logger.debug("new request to login a user", {
      email,
    });

    try {
      const user = await this.authService.login({ email, password });

      this.logger.info("User has been loged in", { id: user.id });

      const payload: Jwt.JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      const accessToken = this.tokenService.generateAccessToken(payload);

      const refreshToken = this.tokenService.generateRefreshToken(
        payload,
        newRefreshToken.id,
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });

      return res.json({ id: user.id });
    } catch (error) {
      return next(error);
    }
  }

  async self(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    this.logger.debug("new request to self data");

    try {
      const user = await this.authService.me({ id: Number(req.auth.sub) });
      return res.json({ ...user, password: undefined });
    } catch (error) {
      return next(error);
    }
  }

  async refresh(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    this.logger.debug("new request for refresh token");

    try {
      const payload: Jwt.JwtPayload = {
        sub: req.auth.sub,
        role: req.auth.role,
      };

      const user = await this.authService.me({ id: Number(req.auth.sub) });

      if (!user) {
        return next(createHttpError(500));
      }

      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      await this.tokenService.removeRefreshToken(Number(req.auth.jti));

      const accessToken = this.tokenService.generateAccessToken(payload);

      const refreshToken = this.tokenService.generateRefreshToken(
        payload,
        newRefreshToken.id,
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });

      return res.json({ id: user.id });
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    this.logger.debug("new request to logout");

    try {
      await this.tokenService.removeRefreshToken(Number(req.auth.jti));
      this.logger.info("refresh token has been deleted", { id: req.auth.jti });
      this.logger.info("user has been logged out", { id: req.auth.sub });

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      this.logger.info("cookies cleared");

      return res.json({ id: req.auth.sub });
    } catch (error) {
      return next(error);
    }
  }
}

export { AuthController };
