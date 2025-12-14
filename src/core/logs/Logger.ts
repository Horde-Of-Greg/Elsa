import { Console } from "console";

import { AnsiFg, AnsiFgBright, AnsiStyle } from "../../assets/colors/ansi";
import { appConfig, env } from "../../config/appConfig";
import { getTimeNow } from "../../utils/time";
import { FileStream } from "./streams/FileStream";
import { MultiStream } from "./streams/MultiStream";
import { TerminalStream } from "./streams/TerminalStream";

export class Logger {
    private readonly terminalConsole: Console;
    private readonly fileConsole: Console;
    private readonly console: Console;

    private readonly infoStreams = {
        terminal: new TerminalStream({ name: "info-terminal", target: "stdout" }),
        files: new FileStream({ name: "info-files", fileName: "logs.log" }),
    };

    private readonly errStreams = {
        terminal: new TerminalStream({ name: "err-terminal", target: "stderr" }),
        files: new FileStream({ name: "error-files", fileName: "errors.log" }),
    };

    constructor() {
        this.terminalConsole = new Console({
            stdout: this.infoStreams.terminal,
            stderr: this.errStreams.terminal,
            colorMode: true,
        });

        this.fileConsole = new Console({
            stdout: this.infoStreams.files,
            stderr: this.errStreams.files,
            colorMode: false,
        });

        this.console = new Console({
            stdout: new MultiStream({ name: "info", streams: Object.values(this.infoStreams) }),
            stderr: new MultiStream({ name: "error", streams: Object.values(this.errStreams) }),
        });
        this.logAll();
    }
    private logAll() {
        if (!appConfig.LOGS.VERBOSE_LOGGING) return;
        this.info("this is an info log");
        this.warn("this is a warning log");
        this.error("this is an error log");
        this.debug("this is a debug log");
    }

    info(message: string, ...args: unknown[]): void {
        this.console.log(this.format("INFO", message, AnsiFg.CYAN), ...args);
    }

    warn(message: string, ...args: unknown[]): void {
        this.console.warn(this.format("WARN", message, AnsiFgBright.YELLOW), ...args);
    }

    error(message: string, ...args: unknown[]): void {
        this.console.error(this.format("ERROR", message, AnsiFg.RED), ...args);
    }

    debug(message: string, ...args: unknown[]): void {
        if (env.ENVIRONMENT === "production") return;
        this.console.debug(this.format("DEBUG", message, AnsiFg.MAGENTA), ...args);
    }

    private format(level: string, message: string, color: AnsiFg | AnsiFgBright): string {
        const timestamp = getTimeNow().toISOString();
        const newMessage = message[0].toUpperCase() + message.slice(1);
        return `${color}[${timestamp}] [${level}] ${newMessage}${AnsiStyle.RESET}`;
    }

    async shutdown(): Promise<void> {
        await Promise.all([
            new Promise<void>((r) =>
                Object.values(this.infoStreams).forEach((infoStream) => infoStream.end(r)),
            ),
            new Promise<void>((r) => Object.values(this.errStreams).forEach((errStream) => errStream.end(r))),
        ]);
    }
}
