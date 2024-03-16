import { CONFIG } from "@/config";
import { RefreshToken } from "@/entity/refresh-token";
import { User } from "@/entity/user";
import createHttpError from "http-errors";
import Jwt, { sign } from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";
import { Repository } from "typeorm";

class TokenService {
  constructor(private refreshTokenRepository: Repository<RefreshToken>) {
    this.refreshTokenRepository = refreshTokenRepository;
  }

  generateAccessToken(payload: Jwt.JwtPayload): string {
    let privateKey: Buffer;
    try {
      privateKey = fs.readFileSync(
        path.join(__dirname, "../../certs/private.pem"),
      );
    } catch (error) {
      const err = createHttpError(500, "Private key not to be null");
      throw err;
    }

    const accessToken = sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer: "auth-service",
    });

    return accessToken;
  }

  generateRefreshToken(payload: Jwt.JwtPayload, id: number): string {
    const refreshToken = sign(payload, CONFIG.REFRESH_TOKEN_SECRET!, {
      algorithm: "HS256",
      expiresIn: "1y",
      issuer: "auth-service",
      jwtid: String(id),
    });

    return refreshToken;
  }

  async persistRefreshToken(user: User) {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
    const newRefreshToken = await this.refreshTokenRepository.save({
      user: user,
      expires_at: new Date(Date.now() + MS_IN_YEAR),
    });
    return newRefreshToken;
  }

  async removeRefreshToken(id: number) {
    try {
      await this.refreshTokenRepository.delete({ id });
    } catch (error) {
      const err = createHttpError(500, "cant delete refresh token");
      throw err;
    }
  }
}

export { TokenService };
