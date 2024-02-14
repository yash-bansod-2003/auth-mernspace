import express, { type Express, urlencoded, json } from "express";
import morgan from "morgan";
import cors from "cors";
import { errorHandler } from "@/middlewares/error-handler";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .post("/sample", (_, res) => {
      return res.status(201).json({ ok: true });
    })
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .post("/todo", (req, res) => {
      return res.status(201).json({ message: `todu` });
    })
    .use(errorHandler);

  return app;
};
