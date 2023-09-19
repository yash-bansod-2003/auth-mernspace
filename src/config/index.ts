import dotenv from "dotenv";
dotenv.config();

const { PORT, NODE_ENV } = process.env;

export const CONFIG = { PORT, NODE_ENV };
