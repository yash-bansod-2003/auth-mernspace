import { createLogger, transports, format } from "winston";

const logger = createLogger({
  level: "info",
  defaultMeta: { serviceName: "templete" },
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(format.timestamp(), format.simple()),
    }),
    new transports.File({
      dirname: "logs",
      filename: "combined.log",
      level: "info",
      format: format.combine(format.timestamp(), format.simple()),
    }),
    new transports.File({
      dirname: "logs",
      filename: "errors.log",
      level: "error",
      format: format.combine(format.timestamp(), format.simple()),
    }),
  ],
});

export { logger };
