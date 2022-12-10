import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import { readEnv } from "./readEnv";

const rotateFileTransport = new transports.DailyRotateFile({
  dirname: "logs",
  filename: "pratarn-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "7d",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info) => `${info.timestamp} [${info.level}] - ${info.message}`
    )
  ),
});

const consoleTransport = new transports.Console({
  handleExceptions: true,
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info) => `${info.timestamp} [${info.level}] - ${info.message}`
    )
  ),
});

export default createLogger({
  level: readEnv("LOG_LEVEL") || "verbose",
  transports: [consoleTransport, rotateFileTransport],
});
