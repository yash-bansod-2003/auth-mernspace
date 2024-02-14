import { createServer } from "@/server";
import { logger } from "@/config/logger";
import { CONFIG } from "@/config";
import { connectToDatabase } from "@/lib/db";

const host = CONFIG.HOST ?? "localhost";
const port = CONFIG.PORT ? Number(CONFIG.PORT) : 3000;

const server = createServer();

server.listen(port, host, () => {
  try {
    logger.info(`Server Listening on port ${port}`);
    connectToDatabase(CONFIG.DB_URL!)
      .then(() => logger.info("connected to database"))
      .catch((err) => logger.error(err));
  } catch (error) {
    logger.error(`Error ${(error as Error).message}`);
    process.exit(1);
  }
});
