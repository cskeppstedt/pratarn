import { config, createLogger, format, transports } from "winston";

const consoleTransport = new transports.Console({
  handleExceptions: true
});

const fileTransport = new transports.File({
  dirname: "logs",
  filename: "pratarn.log",
  maxFiles: 7,
  maxsize: 1024 * 1024 * 30
});

export default createLogger({
  level: process.env.LOG_LEVEL || "verbose",
  transports: [consoleTransport, fileTransport]
});
