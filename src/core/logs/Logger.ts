import type { Console } from "console";

import { AnsiFg, AnsiFgBright, AnsiStyle } from "../../assets/colors/ansi";
import { env } from "../../config/appConfig";
import { getTimeNow } from "../../utils/time";
import { consoleContainer } from "./consoleRepo";
import { FileStream } from "./streams/FileStream";
import { TerminalStream } from "./streams/TerminalStream";
import { LogLevel } from "./types";

interface LogConfigs {
    trace: AnsiFgBright | AnsiFg;
    debug: AnsiFgBright | AnsiFg;
    info: AnsiFgBright | AnsiFg;
    warn: AnsiFgBright | AnsiFg;
    error: AnsiFgBright | AnsiFg;
}

const logConfigs: LogConfigs = {
    trace: AnsiFg.RED,
    debug: AnsiFg.MAGENTA,
    info: AnsiFg.CYAN,
    warn: AnsiFgBright.YELLOW,
    error: AnsiFg.RED,
};

export class Logger {
    private readonly console: Console;
    private readonly terminalConsole: Console;
    private readonly debugConsole: Console;
    private readonly debugFileConsole: Console;

    private readonly infoStreams = {
        terminal: new TerminalStream({ name: "info-terminal", target: "stdout" }),
        files: new FileStream({ name: "info-files", fileName: "logs.log" }),
    };

    private readonly debugStreams = {
        terminal: new TerminalStream({ name: "debug-terminal", target: "stdout" }),
        files: new FileStream({ name: "debug-files", fileName: "debug.log" }),
    };

    private readonly errStreams = {
        terminal: new TerminalStream({ name: "err-terminal", target: "stderr" }),
        files: new FileStream({ name: "error-files", fileName: "errors.log" }),
    };

    constructor() {
        this.console = consoleContainer.appConsole;
        this.terminalConsole = consoleContainer.terminalConsole;
        this.debugConsole = consoleContainer.debugConsole;
        this.debugFileConsole = consoleContainer.debugFileConsole;
    }

    trace(message: string, ...args: unknown[]): void {
        if (!(env.ENVIRONMENT === "production")) {
            this.debugConsole.trace(this.format(LogLevel.TRACE, message, logConfigs.trace), ...args);
            return;
        }
        this.debugFileConsole.trace(this.format(LogLevel.TRACE, message), ...args);
    }

    debug(message: string, ...args: unknown[]): void {
        if (!(env.ENVIRONMENT === "production")) {
            this.debugConsole.debug(this.format(LogLevel.TRACE, message, logConfigs.debug), ...args);
            return;
        }
        this.debugFileConsole.debug(this.format(LogLevel.TRACE, message), ...args);
    }

    info(message: string, ...args: unknown[]): void {
        this.console.log(this.format(LogLevel.INFO, message, logConfigs.info), ...args);
    }

    warn(message: string, ...args: unknown[]): void {
        this.terminalConsole.warn(this.format(LogLevel.WARN, message, logConfigs.warn), ...args);
    }

    error(message: string, ...args: unknown[]): void {
        this.console.error(this.format(LogLevel.ERROR, message, logConfigs.error), ...args);
    }

    private format(level: LogLevel, message: string, color?: AnsiFg | AnsiFgBright): string {
        const timestamp = getTimeNow().toISOString();
        const newMessage = message[0].toUpperCase() + message.slice(1);
        return `${color !== undefined ? color : ""}[${timestamp}] [${LogLevel[level]}] ${newMessage}${color !== undefined ? AnsiStyle.RESET : ""}`;
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
