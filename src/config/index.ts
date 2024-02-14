import path from "node:path";
import { config } from "dotenv";

config({
  path: path.join(
    __dirname,
    `../../environments/.env.${process.env.NODE_ENV}.local`,
  ),
});

const { PORT, NODE_ENV } = process.env;

export const CONFIG = { PORT, NODE_ENV };
