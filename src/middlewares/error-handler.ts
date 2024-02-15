import type { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import { logger } from "@/config/logger";

const errorHandler = (
  err: HttpError | Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: NextFunction,
): void => {
  logger.error(err);
  let statusCode = 500;

  if (err instanceof HttpError) {
    statusCode = err.statusCode;
  }

  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: err.message,
        path: "",
        location: "",
      },
    ],
  });
};

export { errorHandler };
