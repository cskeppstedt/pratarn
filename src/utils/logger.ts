import { config, createLogger, format, transports } from "winston";

const consoleTransport = new transports.Console({
  handleExceptions: true,
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((info) => `${info.timestamp} [${info.level}] - ${info.message}`)
  )
});

export default createLogger({
  level: process.env.LOG_LEVEL || "verbose",
  transports: [consoleTransport]
});
