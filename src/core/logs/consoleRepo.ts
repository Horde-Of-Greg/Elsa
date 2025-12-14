import { Console } from "console";

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
}

export const consoleContainer = new ConsoleContainer();
