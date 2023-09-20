import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";
import { HttpError } from "http-errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
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
