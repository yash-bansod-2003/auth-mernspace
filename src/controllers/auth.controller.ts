import { AuthService } from "@/services/auth.service";
import { Request, Response, NextFunction } from "express";
import { UserData } from "@/types";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import Jwt, { sign } from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";

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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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

      const privateKey = fs.readFileSync(
        path.join(__dirname, "../../certs/private.pem"),
      );

      const payload: Jwt.JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: "auth-service",
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      });

      res.cookie("refreshToken", "token", {
        httpOnly: true,
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });

      return res.status(201).json({ id: user.id });
    } catch (error) {
      return next(error);
    }
  }
}

export { AuthController };
