import type { MessagePayload, MessageReplyOptions } from "discord.js";

import type { AppErrorClientResponse, AppErrorData, AppErrorParams } from "../types/errors/appError";
import type { AppDate } from "../types/time/time";
import { getTimeNow } from "../utils/time";

export abstract class AppError extends Error {
    abstract readonly code?: string;
    abstract readonly httpStatus: number;
    readonly timestamp: AppDate;

    constructor(
        message: string,
        public readonly data?: AppErrorData,
        public readonly stack?: string,
    ) {
        super(message);
        this.name = this.constructor.name;
        this.timestamp = getTimeNow();

        Error.captureStackTrace(this, this.constructor);
    }

    toJSON(): AppErrorParams {
        return {
            name: this.name,
            code: this.code ?? "UNKNOWN",
            message: this.message,
            timestamp: this.timestamp,
            data: this.data,
            stack: this.stack?.split("\n"),
        };
    }

    toClientResponse(): AppErrorClientResponse {
        return {
            error: this.code ?? "UNKNOWN",
            message: this.message,
            timestamp: this.timestamp,
        };
    }

    abstract get reply(): string | MessagePayload | MessageReplyOptions;

    abstract log(): void;
}
