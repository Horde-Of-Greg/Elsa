import fs from "fs";
import path from "path";

import { appConfig } from "../../../config/config";
import { isActionsEnvironment } from "../../../utils/environment";
import { BaseWritableStream, type StreamConfig } from "./BaseWritableStream";

export interface FileStreamConfig extends StreamConfig {
    fileName: string;
    flags?: "a" | "w";
}

export class FileStream extends BaseWritableStream {
    private readonly filePath: string;
    private fileHandle: fs.WriteStream | null = null;

    constructor(config: FileStreamConfig) {
        super(config);
        this.filePath = path.join(appConfig.LOGS.OUTPUT_PATH, config.fileName);
        this.ensureDirectory();
        this.openFile(config.flags ?? "a");
    }

    private ensureDirectory(): void {
        const dir = path.dirname(this.filePath);
        fs.mkdirSync(dir, { recursive: true });
    }

    private openFile(flags: "a" | "w"): void {
        this.fileHandle = fs.createWriteStream(this.filePath, {
            flags,
            encoding: "utf8",
        });
    }

    protected processChunk(data: string): void {
        if (isActionsEnvironment()) return;
        if (!this.fileHandle) {
            throw new Error(`FileStream "${this.name}" is not open`);
        }
        // eslint-disable-next-line no-control-regex
        const clean = data.replace(/\x1b\[[0-9;]*m/g, "");
        this.fileHandle.write(clean);
    }

    protected override async flush(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.fileHandle) return resolve();

            if (!this.fileHandle.writableNeedDrain) {
                return resolve();
            }

            this.fileHandle.once("drain", resolve);
            this.fileHandle.once("error", reject);
        });
    }

    protected override async cleanup(): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            if (!this.fileHandle) return resolve();

            this.fileHandle.end(() => {
                this.fileHandle = null;

                resolve();
            });

            this.fileHandle.once("error", reject);
        });
    }
}
