import winston from "winston";
import path from "path";
import fs from "fs";

const logsDir = path.resolve("logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }), 
  winston.format.splat(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
    let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;

    if (stack) logMessage += `\nStack Trace: ${stack}`; 
    if (metaString) logMessage += `\nMeta: ${metaString}`;

    return logMessage;
  })
);

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: path.join(logsDir, "app.log") }),
    new winston.transports.File({
      filename: path.join(logsDir, "errors.log"),
      level: "error",
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(logsDir, "exceptions.log") }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(logsDir, "rejections.log") }),
  ],
  exitOnError: false,
});

export default logger;
