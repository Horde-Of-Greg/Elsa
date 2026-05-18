import { Console } from "node:console";
import fs from "node:fs";
import path from "node:path";

import type { ConfigsResolver } from "../../types/config/config";
import type { StreamsContainer } from "../../types/logs";
import { compressWithZstd } from "../../utils/compression/zstd";
import { isProductionEnvironment } from "../../utils/node/environment";
import { FileStream } from "../logs/streams/FileStream";
import { MultiStream } from "../logs/streams/MultiStream";
import { TerminalStream } from "../logs/streams/TerminalStream";

export class ConsoleContainer {
    private _infoStreams?: StreamsContainer;
    private _debugStreams?: StreamsContainer;
    private _errStreams?: StreamsContainer;

    private _terminalConsole?: Console;
    private _debugTerminalConsole?: Console;
    private _fileConsole?: Console;
    private _debugFileConsole?: Console;
    private _appConsole?: Console;
    private _debugConsole?: Console;

    constructor(private readonly configs: ConfigsResolver) {}

    private get infoStreams(): StreamsContainer {
        return (this._infoStreams ??= {
            terminal: new TerminalStream({ name: "info-terminal", target: "stdout" }),
            files: new FileStream({ name: "info-files", fileName: "logs.log" }, this.configs),
        });
    }

    private get debugStreams(): StreamsContainer {
        return (this._debugStreams ??= {
            terminal: new TerminalStream({ name: "debug-terminal", target: "stdout" }),
            files: new FileStream({ name: "debug-files", fileName: "debug.log" }, this.configs),
        });
    }

    private get errStreams(): StreamsContainer {
        return (this._errStreams ??= {
            terminal: new TerminalStream({ name: "err-terminal", target: "stderr" }),
            files: new FileStream({ name: "error-files", fileName: "errors.log" }, this.configs),
        });
    }

    get terminalConsole(): Console {
        return (this._terminalConsole ??= new Console({
            stdout: this.infoStreams.terminal,
            stderr: this.errStreams.terminal,
            colorMode: true,
        }));
    }

    get debugTerminalConsole(): Console {
        return (this._debugTerminalConsole ??= new Console({
            stdout: this.debugStreams.terminal,
            stderr: this.errStreams.terminal,
            colorMode: true,
        }));
    }

    get fileConsole(): Console {
        return (this._fileConsole ??= new Console({
            stdout: this.infoStreams.files,
            stderr: this.errStreams.files,
            colorMode: false,
        }));
    }

    get debugFileConsole(): Console {
        return (this._debugFileConsole ??= new Console({
            stdout: this.debugStreams.files,
            stderr: this.errStreams.files,
            colorMode: false,
        }));
    }

    get appConsole(): Console {
        return (this._appConsole ??= new Console({
            stdout: new MultiStream({ name: "info", streams: Object.values(this.infoStreams) }),
            stderr: new MultiStream({ name: "error", streams: Object.values(this.errStreams) }),
        }));
    }

    get debugConsole(): Console {
        return (this._debugConsole ??= new Console({
            stdout: new MultiStream({ name: "debug", streams: Object.values(this.debugStreams) }),
            stderr: new MultiStream({ name: "error", streams: Object.values(this.errStreams) }),
        }));
    }

    start(): void {
        this._infoStreams = undefined;
        this._debugStreams = undefined;
        this._errStreams = undefined;

        this._terminalConsole = undefined;
        this._debugTerminalConsole = undefined;
        this._fileConsole = undefined;
        this._debugFileConsole = undefined;
        this._appConsole = undefined;
        this._debugConsole = undefined;
    }

    async stop(): Promise<void> {
        await Promise.all(
            this.allStreams.map(
                async (stream) =>
                    new Promise<void>((resolve, reject) => {
                        stream.once("close", resolve);
                        stream.once("error", reject);
                        stream.end();
                    }),
            ),
        );
    }

    async shutdown(): Promise<void> {
        if (isProductionEnvironment()) {
            await this.archiveLogs();
        }

        await this.clearLogs();

        await this.stop();
    }

    async reset(): Promise<void> {
        await this.shutdown();
        this.start();
    }

    async archiveLogs(): Promise<void> {
        const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
        const archiveDir = path.join(this.logDir, "archive");

        await fs.promises.mkdir(archiveDir, { recursive: true });
        compressWithZstd(this.logDir, path.join(archiveDir, timestamp));
    }

    async clearLogs(): Promise<void> {
        const files = await fs.promises.readdir(this.logDir);

        for (const file of files) {
            if (file.endsWith(".log")) {
                await fs.promises.truncate(path.join(this.logDir, file), 0);
            }
        }
    }

    private get allStreams(): (TerminalStream | FileStream)[] {
        return [
            ...Object.values(this._infoStreams ?? {}),
            ...Object.values(this._debugStreams ?? {}),
            ...Object.values(this._errStreams ?? {}),
        ];
    }

    private get logDir(): string {
        return this.configs.app.LOGS.OUTPUT_PATH;
    }
}
