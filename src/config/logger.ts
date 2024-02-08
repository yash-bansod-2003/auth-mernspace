import { createLogger, transports, format } from "winston";

const logger = createLogger({
    level: "info",
    defaultMeta: { serviceName: "templete" },
    transports: [
        new transports.Console({
            level: "info",
            format: format.combine(format.timestamp(), format.simple()),
        }),
    ],
});

export { logger };
