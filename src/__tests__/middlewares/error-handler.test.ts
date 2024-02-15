import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { errorHandler } from "@/middlewares/error-handler";
import { logger } from "@/config/logger";

jest.mock("@/config/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe("Global Error Handler", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  it("should handle a generic HTTP error", () => {
    const err = createHttpError(404);
    errorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        { type: "NotFoundError", msg: "Not Found", path: "", location: "" },
      ],
    });
  });

  it("should handle an HTTP error with a custom name", () => {
    const err = createHttpError(403);
    err.name = "CustomError";
    errorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        { type: "CustomError", msg: "Forbidden", path: "", location: "" },
      ],
    });
  });

  it("should handle an HTTP error with a default status code", () => {
    const err = createHttpError();
    errorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        {
          type: "InternalServerError",
          msg: "Internal Server Error",
          path: "",
          location: "",
        },
      ],
    });
  });

  it("should handle other types of errors", () => {
    const err: Error = new Error("Internal Server Error");
    errorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        { type: "Error", msg: "Internal Server Error", path: "", location: "" },
      ],
    });
  });
});
