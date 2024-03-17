import createHttpError from "http-errors";
import Jwt, { sign } from "jsonwebtoken";
import { Repository } from "typeorm";
import { RefreshToken } from "@/entity/refresh-token";
import { User } from "@/entity/user";
import { CONFIG } from "@/config";

class TokenService {
  constructor(private refreshTokenRepository: Repository<RefreshToken>) {
    this.refreshTokenRepository = refreshTokenRepository;
  }

  generateAccessToken(payload: Jwt.JwtPayload): string {
    let privateKey: string;
    if (!CONFIG.PRIVATE_KEY) {
      const error = createHttpError(500, "SECRET_KEY is not set");
      throw error;
    }
    try {
      privateKey = CONFIG.PRIVATE_KEY;
    } catch (err) {
      const error = createHttpError(500, "Error while reading private key");
      throw error;
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
