import path from "node:path";
import fs from "node:fs";
import express, { type Express, urlencoded, json } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { errorHandler } from "@/middlewares/error-handler";
import { authRouter } from "@/routes/auth.router";
import { tenantRouter } from "@/routes/tenant.router";
import { userRouter } from "@/routes/user.router";

const swaggerFile = fs.readFileSync(
  path.join(__dirname, "../public/swagger.yaml"),
  "utf8",
);

const swaggerDocument = YAML.parse(swaggerFile) as swaggerUi.JsonObject;

export const createServer = (): Express => {
  const app = express();
  app
    .use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, { explorer: true }),
    )
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
    .use("/api/v1", authRouter)
    .use("/api/v1", tenantRouter)
    .use("/api/v1/admin", userRouter)
    .use(errorHandler);

  return app;
};
