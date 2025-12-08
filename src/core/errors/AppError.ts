import { AppDate, getTimeNow } from '../../utils/time';

export abstract class AppError extends Error {
    abstract readonly code: string;
    abstract readonly httpStatus?: number;
    readonly timestamp: AppDate;
    readonly cause?: Error | AppError;

    constructor(
        message: string,
        public readonly data?: Record<string, unknown>,
        cause?: Error | AppError,
    ) {
        super(message);
        this.name = this.constructor.name;
        this.timestamp = getTimeNow();
        this.cause = cause;

        Error.captureStackTrace(this, this.constructor);
    }

    /* TODO: Some script to search errors by code. Would make debugging much easier.
     * e.g.
     * input : `npm run search-error TAG_EXISTS`
     * output: `{ class: TagExistsError, file: 409.ts, lines: { start: 3, end: 10 } }`
     *
     * Maybe even add some documentation metadata? Not sure.
     */

    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            timestamp: this.timestamp,
            data: this.data,
            stack: this.stack?.split('\n'),
        };
    }

    toClientResponse() {
        return {
            error: this.code,
            message: this.message,
            timestamp: this.timestamp,
        };
    }
}
