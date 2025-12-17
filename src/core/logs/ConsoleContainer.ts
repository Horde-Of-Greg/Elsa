import { Console } from "console";
import fs from "fs";
import path from "path";

import { appConfig } from "../../config/config";
import { env } from "../../config/env";
import { compressWithZstd } from "../../utils/compression/zstd";
import { FileStream } from "./streams/FileStream";
import { MultiStream } from "./streams/MultiStream";
import { TerminalStream } from "./streams/TerminalStream";

type StreamsContainer = {
    terminal: TerminalStream;
    files: FileStream;
};

class ConsoleContainer {
    private _infoStreams?: StreamsContainer;
    private _debugStreams?: StreamsContainer;
    private _errStreams?: StreamsContainer;

    private _terminalConsole?: Console;
    private _debugTerminalConsole?: Console;
    private _fileConsole?: Console;
    private _debugFileConsole?: Console;
    private _appConsole?: Console;
    private _debugConsole?: Console;

    private get infoStreams() {
        return (this._infoStreams ??= {
            terminal: new TerminalStream({ name: "info-terminal", target: "stdout" }),
            files: new FileStream({ name: "info-files", fileName: "logs.log" }),
        });
    }

    private get debugStreams() {
        return (this._debugStreams ??= {
            terminal: new TerminalStream({ name: "debug-terminal", target: "stdout" }),
            files: new FileStream({ name: "debug-files", fileName: "debug.log" }),
        });
    }

    private get errStreams() {
        return (this._errStreams ??= {
            terminal: new TerminalStream({ name: "err-terminal", target: "stderr" }),
            files: new FileStream({ name: "error-files", fileName: "errors.log" }),
        });
    }

    get terminalConsole() {
        return (this._terminalConsole ??= new Console({
            stdout: this.infoStreams.terminal,
            stderr: this.errStreams.terminal,
            colorMode: true,
        }));
    }

    get debugTerminalConsole() {
        return (this._debugTerminalConsole ??= new Console({
            stdout: this.debugStreams.terminal,
            stderr: this.errStreams.terminal,
            colorMode: true,
        }));
    }

    get fileConsole() {
        return (this._fileConsole ??= new Console({
            stdout: this.infoStreams.files,
            stderr: this.errStreams.files,
            colorMode: false,
        }));
    }

    get debugFileConsole() {
        return (this._debugFileConsole ??= new Console({
            stdout: this.debugStreams.files,
            stderr: this.errStreams.files,
            colorMode: false,
        }));
    }

    get appConsole() {
        return (this._appConsole ??= new Console({
            stdout: new MultiStream({ name: "info", streams: Object.values(this.infoStreams) }),
            stderr: new MultiStream({ name: "error", streams: Object.values(this.errStreams) }),
        }));
    }

    get debugConsole() {
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
        const allStreams = [
            ...Object.values(this._infoStreams ?? {}),
            ...Object.values(this._debugStreams ?? {}),
            ...Object.values(this._errStreams ?? {}),
        ];

        await Promise.all(
            allStreams.map(
                (stream) =>
                    new Promise<void>((resolve, reject) => {
                        stream.once("close", resolve);
                        stream.once("error", reject);
                        stream.end();
                    }),
            ),
        );
    }

    async shutdown(): Promise<void> {
        const allStreams = [
            ...Object.values(this._infoStreams ?? {}),
            ...Object.values(this._debugStreams ?? {}),
            ...Object.values(this._errStreams ?? {}),
        ];

        if (env.ENVIRONMENT === "production") {
            await this.archiveLogs();
        }

        await this.clearLogs();

        await Promise.all(
            allStreams.map(
                (stream) =>
                    new Promise<void>((resolve, reject) => {
                        stream.once("close", resolve);
                        stream.once("error", reject);
                        stream.end();
                    }),
            ),
        );
    }

    async archiveLogs(): Promise<void> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const logDir = appConfig.LOGS.OUTPUT_PATH;
        const archiveDir = path.join(logDir, "archive");

        await fs.promises.mkdir(archiveDir, { recursive: true });
        compressWithZstd(logDir, path.join(archiveDir, timestamp));
    }

    async clearLogs(): Promise<void> {
        const logDir = appConfig.LOGS.OUTPUT_PATH;
        const files = await fs.promises.readdir(logDir);

        for (const file of files) {
            if (file.endsWith(".log")) {
                await fs.promises.truncate(path.join(logDir, file), 0);
            }
        }
    }
}

export const consoleContainer = new ConsoleContainer();
