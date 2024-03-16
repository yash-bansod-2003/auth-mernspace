import { expressjwt } from "express-jwt";
import { CONFIG } from "@/config";
import { Request } from "express";
import { AppDataSource } from "@/data-source";
import { RefreshToken } from "@/entity/refresh-token";
import { logger } from "@/config/logger";

export default expressjwt({
  secret: CONFIG.REFRESH_TOKEN_SECRET!,
  algorithms: ["HS256"],
  getToken(req: Request) {
    const { refreshToken: token } = req.cookies;
    return token;
  },
  isRevoked: async (req: Request, token) => {
    try {
      const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
      const refreshToken = await refreshTokenRepository.findOne({
        where: {
          id: Number((token?.payload as { jti: string }).jti),
          user: { id: Number(token?.payload.sub) },
        },
      });
      return refreshToken === null;
    } catch (error) {
      logger.error("error refresh token", error);
    }
    return true;
  },
});
