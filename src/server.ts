import app from "./app";
import { CONFIG } from "./config";
import logger from "./config/logger";

const startServer = () => {
    try {
        app.listen(CONFIG.PORT, () =>
            logger.info(`Listening on port ${CONFIG.PORT}`),
        );
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
};

startServer();
