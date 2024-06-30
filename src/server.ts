import express, { type Express, urlencoded, json } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "@/middlewares/error-handler";
import { authRouter } from "@/routes/auth.router";
import { tenantRouter } from "@/routes/tenant.router";
import { userRouter } from "@/routes/user.router";

export const createServer = (): Express => {
  const app = express();
  app
    .use(cors({ origin: ["http://localhost:5173"], credentials: true }))
    .use(json())
    .use(urlencoded({ extended: true }))
    .use(morgan("dev"))
    .use(cookieParser())
    .use(express.static("public"))
    .disable("x-powered-by")
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .use("/api/auth", authRouter)
    .use("/api", tenantRouter)
    .use("/api", userRouter)
    .use(errorHandler);

  return app;
};
