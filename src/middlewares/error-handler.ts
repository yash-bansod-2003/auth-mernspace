import type { Request, Response, NextFunction } from "express";
import type { HttpError } from "http-errors";
import { logger } from "@/config/logger";

const errorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    _: NextFunction,
): void => {
    logger.error(err);
    const statusCode = err.statusCode || 500;
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
