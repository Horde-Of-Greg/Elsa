import type { MessagePayload, MessageReplyOptions } from "discord.js";

import type { ConfigsResolver } from "../types/config/config";
import type { LoggerResolver } from "../types/core/logs";
import type { AppErrorClientResponse, AppErrorData, AppErrorParams } from "../types/errors/appError";
import type { AppDate } from "../types/time/time";

export abstract class AppError extends Error {
    abstract readonly code?: string;
    abstract readonly httpStatus: number;
    readonly timestamp: AppDate;

    constructor(
        message: string,
        public readonly data?: AppErrorData,
        public readonly stack?: string,
        protected readonly configs?: ConfigsResolver,
    ) {
        super(message);
        this.name = this.constructor.name;
        this.timestamp = new Date();

        Error.captureStackTrace(this, this.constructor);
    }

    toJSON(): AppErrorParams {
        return {
            name: this.name,
            code: this.code ?? "UNKNOWN_ERROR",
            message: this.message,
            timestamp: this.timestamp,
            data: this.data,
            stack: this.stack?.split("\n"),
        };
    }

    toClientResponse(): AppErrorClientResponse {
        return {
            error: this.code ?? "UNKNOWN_ERROR",
            message: this.message,
            timestamp: this.timestamp,
        };
    }

    abstract get reply(): string | MessagePayload | MessageReplyOptions;

    abstract log(logger: LoggerResolver): void;
}
