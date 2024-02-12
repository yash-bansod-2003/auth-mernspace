import { createServer } from "@/server";
import { logger } from "@/config/logger";
import { CONFIG } from "@/config";

const port = CONFIG.PORT ?? 5001;
const server = createServer();

server.listen(port, () => {
  try {
    logger.info(`Server Listening on port ${port}`);
  } catch (error) {
    logger.error(`Error ${(error as Error).message}`);
    process.exit(1);
  }
});
