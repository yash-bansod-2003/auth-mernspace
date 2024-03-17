import { AuthenticatedRequest } from "@/types";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

const canAccess = (roles: Array<string>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const roleFromTone = (req as unknown as AuthenticatedRequest).auth.role;

    if (!roles.includes(roleFromTone)) {
      return next(createHttpError(403));
    }
    return next();
  };
};

export { canAccess };
