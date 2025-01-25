import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
        (info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
    )
);

const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            format
        ),
    }),
    new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        level: 'error',
        format,
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
    }),
    new DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        format,
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
    }),
];

const Logger = winston.createLogger({
    levels,
    format,
    transports,
});

export default Logger;