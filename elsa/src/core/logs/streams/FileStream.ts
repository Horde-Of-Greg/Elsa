import fs from "node:fs";
import path from "node:path";

import type { ConfigsResolver } from "../../../types/config/config";
import type { FileStreamConfig } from "../../../types/core/streams";
import { BaseWritableStream } from "./BaseWritableStream";

export class FileStream extends BaseWritableStream {
    private readonly filePath: string;
    private fileHandle: fs.WriteStream | null = null;

    constructor(config: FileStreamConfig, appConfigs: ConfigsResolver) {
        super(config);
        this.filePath = path.join(appConfigs.app.LOGS.OUTPUT_PATH, config.fileName);
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
        if (!this.fileHandle) {
            // eslint-disable-next-line no-restricted-syntax
            throw new Error(`FileStream "${this.name}" is not open`);
        }
        // eslint-disable-next-line no-control-regex
        const clean = data.replaceAll(/\x1b\[[0-9;]*m/g, "");
        this.fileHandle.write(clean);
    }

    protected override async flush(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.fileHandle) {
                resolve();
                return;
            }

            if (!this.fileHandle.writableNeedDrain) {
                resolve();
                return;
            }

            this.fileHandle.once("drain", resolve);
            this.fileHandle.once("error", reject);
        });
    }

    protected override async cleanup(): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            if (!this.fileHandle) {
                resolve();
                return;
            }

            this.fileHandle.end(() => {
                this.fileHandle = null;

                resolve();
            });

            this.fileHandle.once("error", reject);
        });
    }
}
