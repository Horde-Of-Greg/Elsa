import { Console } from 'console';
import type { BaseWritableStream } from './streams/BaseWritableStream';
import { deprecate } from 'util';

export interface LoggerConfig {
    name: string;
    stdout: BaseWritableStream;
    stderr: BaseWritableStream;
}

export class Logger {
    private readonly console: Console;
    private readonly stdout: BaseWritableStream;
    private readonly stderr: BaseWritableStream;

    constructor(config: LoggerConfig) {
        this.stdout = config.stdout;
        this.stderr = config.stderr;

        this.console = new Console({
            stdout: this.stdout,
            stderr: this.stderr,
            colorMode: true,
        });
    }

    simpleLog = deprecate((oldType: string, message: string) => {
        this.info(message);
    }, 'Please use logger.info, logger.warn, logger.error or logger.debug instead');

    info(message: string, ...args: unknown[]): void {
        this.console.log(this.format('INFO', message), ...args);
    }

    warn(message: string, ...args: unknown[]): void {
        this.console.warn(this.format('WARN', message), ...args);
    }

    error(message: string, ...args: unknown[]): void {
        this.console.error(this.format('ERROR', message), ...args);
    }

    debug(message: string, ...args: unknown[]): void {
        this.console.debug(this.format('DEBUG', message), ...args);
    }

    private format(level: string, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] ${message}`;
    }

    async shutdown(): Promise<void> {
        await Promise.all([
            new Promise<void>((r) => this.stdout.end(r)),
            new Promise<void>((r) => this.stderr.end(r)),
        ]);
    }
}
