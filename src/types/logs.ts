import type { FileStream } from "../core/logs/streams/FileStream.js";
import type { TerminalStream } from "../core/logs/streams/TerminalStream.js";

export enum LogLevel {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    FATAL = 5,
}

export type StreamsContainer = {
    terminal: TerminalStream;
    files: FileStream;
};
