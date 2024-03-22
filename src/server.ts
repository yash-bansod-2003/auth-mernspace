import express, { type Express, urlencoded, json } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "@/middlewares/error-handler";
import { authRouter } from "@/routes/auth.router";
import { tenantRouter } from "@/routes/tenant.router";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(express.static("public"))
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cookieParser())
    .use(cors({ origin: ["http://localhost:5173"], credentials: true }))
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .use("/api/auth", authRouter)
    .use("/api", tenantRouter)
    .use(errorHandler);

  return app;
};
