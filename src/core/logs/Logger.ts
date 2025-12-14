import { Console } from "console";

import { AnsiFg, AnsiFgBright, AnsiStyle } from "../../assets/colors/ansi";
import { env } from "../../config/appConfig";
import { getTimeNow } from "../../utils/time";
import { consoleContainer } from "./ConsoleContainer";
import { LogLevel } from "./types";

interface LogConfigs {
    trace: AnsiFgBright | AnsiFg;
    debug: AnsiFgBright | AnsiFg;
    info: AnsiFgBright | AnsiFg;
    warn: AnsiFgBright | AnsiFg;
    error: AnsiFgBright | AnsiFg;
}

const logConfigs: Record<keyof typeof LogLevel, AnsiFg | AnsiFgBright> = {
    TRACE: AnsiFg.RED,
    DEBUG: AnsiFg.MAGENTA,
    INFO: AnsiFg.CYAN,
    WARN: AnsiFgBright.YELLOW,
    ERROR: AnsiFg.RED,
    FATAL: AnsiFgBright.RED,
};

export class Logger {
    private console: Console;
    private terminalConsole: Console;
    private debugConsole: Console;
    private debugFileConsole: Console;

    constructor() {
        this.initConsoles();
    }

    trace(message: string, ...args: unknown[]): void {
        if (env.ENVIRONMENT !== "production") {
            this.debugConsole.trace(this.format(LogLevel.TRACE, message, logConfigs.TRACE), ...args);
            return;
        }
        this.debugFileConsole.trace(this.format(LogLevel.TRACE, message), ...args);
    }

    debug(message: string, ...args: unknown[]): void {
        if (env.ENVIRONMENT !== "production") {
            this.debugConsole.debug(this.format(LogLevel.DEBUG, message, logConfigs.DEBUG), ...args);
            return;
        }
        this.debugFileConsole.debug(this.format(LogLevel.DEBUG, message), ...args);
    }

    info(message: string, ...args: unknown[]): void {
        this.console.log(this.format(LogLevel.INFO, message, logConfigs.INFO), ...args);
    }

    warn(message: string, ...args: unknown[]): void {
        this.console.warn(this.format(LogLevel.WARN, message, logConfigs.WARN), ...args);
    }

    warnUser(message: string, ...args: unknown[]): void {
        this.terminalConsole.warn(this.format(LogLevel.WARN, message, logConfigs.WARN), ...args);
    }

    error(message: string, ...args: unknown[]): void {
        this.console.error(this.format(LogLevel.ERROR, message, logConfigs.ERROR), ...args);
    }

    private format(level: LogLevel, message: string, color?: AnsiFg | AnsiFgBright): string {
        const timestamp = getTimeNow().toISOString();
        const newMessage = message[0].toUpperCase() + message.slice(1);
        return `${color !== undefined ? color : ""}[${timestamp}] [${LogLevel[level]}] ${newMessage}${color !== undefined ? AnsiStyle.RESET : ""}`;
    }

    async shutdown(): Promise<void> {
        await consoleContainer.shutdown();
    }

    async stop(): Promise<void> {
        this.warnUser("Stopping Logger!");
        await consoleContainer.stop();
        this.switchToBackupConsoles();
    }

    start(): void {
        consoleContainer.start();
        this.initConsoles();
        this.info("Logger Back!");
    }

    private switchToBackupConsoles() {
        const console = new Console({
            stdout: process.stdout,
            stderr: process.stderr,
            colorMode: false,
        });
        this.console = console;
        this.terminalConsole = console;
        this.debugConsole = console;
        this.debugFileConsole = console;
    }

    private initConsoles() {
        this.console = consoleContainer.appConsole;
        this.terminalConsole = consoleContainer.terminalConsole;
        this.debugConsole = consoleContainer.debugConsole;
        this.debugFileConsole = consoleContainer.debugFileConsole;
    }
}
