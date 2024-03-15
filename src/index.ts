import "reflect-metadata";
import { createServer } from "@/server";
import { logger } from "@/config/logger";
import { CONFIG } from "@/config";

const host = CONFIG.HOST ?? "localhost";
const port = CONFIG.PORT ? Number(CONFIG.PORT) : 3000;

const server = createServer();

server.listen(port, host, () => {
  logger.info(`Server Listening on port ${port}`);
});
