import express, { type Express, urlencoded, json } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "@/middlewares/error-handler";
import { authRouter } from "@/routes/auth.router";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cookieParser())
    .use(cors())
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .use("/api/auth", authRouter)
    .use(errorHandler);

  return app;
};
