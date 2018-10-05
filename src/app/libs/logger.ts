import winston from "winston";
import { format } from "logform";

export const logger = winston.createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  transports: [new winston.transports.Console()]
});
