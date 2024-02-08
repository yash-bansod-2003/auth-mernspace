import { config } from "dotenv";

config();

const { PORT, NODE_ENV } = process.env;

export const CONFIG = { PORT, NODE_ENV };
