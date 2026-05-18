import { Console } from "node:console";

import { AnsiFg, AnsiFgBright, AnsiStyle } from "../../assets/colors/ansi";
import type { ConsoleContainerResolver } from "../../types/core/containers";
import type { LoggerResolver } from "../../types/core/logs";
import { LogLevel } from "../../types/logs";
import { isProductionEnvironment } from "../../utils/node/environment";
import { getTimestampNow } from "../../utils/time";

const logConfigs: Record<keyof typeof LogLevel, AnsiFg | AnsiFgBright> = {
    TRACE: AnsiFg.RED,
    DEBUG: AnsiFg.MAGENTA,
    INFO: AnsiFg.CYAN,
    WARN: AnsiFgBright.YELLOW,
    ERROR: AnsiFg.RED,
    FATAL: AnsiFgBright.RED,
};

export class Logger implements LoggerResolver {
    private console: Console;
    private terminalConsole: Console;
    private debugConsole: Console;
    private debugFileConsole: Console;

    constructor(private readonly consoleContainer: ConsoleContainerResolver) {
        this.initConsoles();
    }

    trace(message: string, ...args: unknown[]): void {
        if (!isProductionEnvironment()) {
            this.debugConsole.trace(this.format(LogLevel.TRACE, message, logConfigs.TRACE), ...args);
            return;
        }
        this.debugFileConsole.trace(this.format(LogLevel.TRACE, message), ...args);
    }

    debug(message: string, ...args: unknown[]): void {
        if (!isProductionEnvironment()) {
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
        const timestamp = getTimestampNow();
        const newMessage = message[0].toUpperCase() + message.slice(1);
        return `${color ?? ""}[${timestamp}] [${LogLevel[level]}] ${newMessage}${color !== undefined ? AnsiStyle.RESET : ""}`;
    }

    async shutdown(): Promise<void> {
        await this.consoleContainer.shutdown();
    }

    async stop(): Promise<void> {
        this.warnUser("Stopping Logger!");
        await this.consoleContainer.stop();
        this.switchToBackupConsoles();
    }

    start(): void {
        this.consoleContainer.start();
        this.initConsoles();
        this.info("Logger Back!");
    }

    async reset(): Promise<void> {
        await this.stop();
        this.start();
    }

    private switchToBackupConsoles(): void {
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

    private initConsoles(): void {
        this.console = this.consoleContainer.appConsole;
        this.terminalConsole = this.consoleContainer.terminalConsole;
        this.debugConsole = this.consoleContainer.debugConsole;
        this.debugFileConsole = this.consoleContainer.debugFileConsole;
    }
}
