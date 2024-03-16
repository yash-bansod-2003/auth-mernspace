import "reflect-metadata";
import { createServer } from "@/server";
import { logger } from "@/config/logger";
import { CONFIG } from "@/config";
import { AppDataSource } from "./data-source";

const host = CONFIG.HOST ?? "localhost";
const port = CONFIG.PORT ? Number(CONFIG.PORT) : 3000;

const server = createServer();

server.listen(port, host, async () => {
  try {
    await AppDataSource.initialize();
    logger.info(`Server Listening on port ${port}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
});
