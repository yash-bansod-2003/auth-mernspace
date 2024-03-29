import { createLogger, transports, format } from "winston";
import { CONFIG } from "@/config";

const logger = createLogger({
  level: "info",
  defaultMeta: { serviceName: "templete" },
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(format.timestamp(), format.simple()),
      silent: CONFIG.NODE_ENV === "test",
    }),
    new transports.File({
      dirname: "logs",
      filename: "combined.log",
      level: "info",
      format: format.combine(format.timestamp(), format.simple()),
      silent: CONFIG.NODE_ENV === "test",
    }),
    new transports.File({
      dirname: "logs",
      filename: "errors.log",
      level: "error",
      format: format.combine(format.timestamp(), format.simple()),
      silent: CONFIG.NODE_ENV === "test",
    }),
  ],
});

export { logger };
