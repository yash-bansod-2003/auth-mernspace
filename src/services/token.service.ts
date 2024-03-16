import { CONFIG } from "@/config";
import createHttpError from "http-errors";
import Jwt, { sign } from "jsonwebtoken";
import fs from "node:fs";
import path from "node:path";

class TokenService {
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

  generateRefreshToken(payload: Jwt.JwtPayload): string {
    const refreshToken = sign(payload, CONFIG.REFRESH_TOKEN_SECRET!, {
      algorithm: "HS256",
      expiresIn: "1y",
      issuer: "auth-service",
      jwtid: String(payload.id),
    });

    return refreshToken;
  }
}

export { TokenService };
