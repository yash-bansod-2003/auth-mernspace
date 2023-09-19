import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    defaultMeta: { serviceName: "templete" },
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple(),
            ),
        }),
    ],
});

export default logger;
