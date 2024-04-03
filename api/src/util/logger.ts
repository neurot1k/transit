import winston from 'winston';
import 'winston-daily-rotate-file';
import { resolve } from 'path';


//const level = settings.LOG_LEVEL ? settings.LOG_LEVEL : process.env.NODE_ENV === 'production' ? 'info' : 'debug';
const level = 'debug';
const LOG_LOCATION = '../../logs/transit-api.debug.log';

const options = {
  level,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message, ...metadata }) => (
      `${timestamp} [${level.toUpperCase()}] ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata) : ''}`
    ))
  ),
  transports: [
    new winston.transports.File({ filename: resolve(LOG_LOCATION, 'rwis-error.log'), level: 'error' }),
    new winston.transports.DailyRotateFile({
      filename: resolve(LOG_LOCATION, 'rwis-combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '7d',
      maxSize: '1m',
    }),
  ],
};

if (process.env.NODE_ENV === 'development') {
  options.transports.push(
    new winston.transports.Console({
      level,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default winston.createLogger(options);