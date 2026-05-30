import type { BaseWritableStream } from "../../core/logs/streams/BaseWritableStream";

export interface StreamConfig {
    name: string;
    encoding?: BufferEncoding;
}

export interface TerminalStreamConfig extends StreamConfig {
    target: "stdout" | "stderr";
}
export interface MultiStreamConfig extends StreamConfig {
    streams: BaseWritableStream[];
}
export interface FileStreamConfig extends StreamConfig {
    fileName: string;
    flags?: "a" | "w";
}
