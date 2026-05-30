import type { ResettableAsync } from "../general";

export interface LoggerResolver extends ResettableAsync {
    trace(message: string, ...args: unknown[]): void;
    debug(message: string, ...args: unknown[]): void;
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    warnUser(message: string, ...args: unknown[]): void;
    error(message: string, ...args: unknown[]): void;

    shutdown(): Promise<void>;
    stop(): Promise<void>;
    start(): void;
}
