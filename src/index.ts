import { createServer } from "@/server";
import { logger } from "@/config/logger";
import { CONFIG } from "@/config";

const host = CONFIG.HOST ?? "localhost";
const port = CONFIG.PORT ? Number(CONFIG.PORT) : 3000;

const server = createServer();

server.listen(port, host, () => {
  try {
    logger.info(`Server Listening on port ${port}`);
  } catch (error) {
    logger.error(`Error ${(error as Error).message}`);
    process.exit(1);
  }
});
