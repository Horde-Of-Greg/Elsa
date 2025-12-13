import { Console } from 'console';
import { deprecate } from 'util';

import { env } from '../../config/appConfig';
import { FileStream } from './streams/FileStream';
import { MultiStream } from './streams/MultiStream';
import { TerminalStream } from './streams/TerminalStream';

export class Logger {
    private readonly terminalConsole: Console;
    private readonly fileConsole: Console;
    private readonly console: Console;

    private readonly infoStreams = {
        terminal: new TerminalStream({ name: 'info-terminal', target: 'stdout' }),
        files: new FileStream({ name: 'info-files', fileName: 'logs.log' }),
    };

    private readonly errStreams = {
        terminal: new TerminalStream({ name: 'err-terminal', target: 'stderr' }),
        files: new FileStream({ name: 'error-files', fileName: 'errors.log' }),
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
            stdout: new MultiStream({ name: 'info', streams: Object.values(this.infoStreams) }),
            stderr: new MultiStream({ name: 'error', streams: Object.values(this.errStreams) }),
        });
    }

    simpleLog = deprecate((oldType: string, message: string) => {
        this.info(this.terminalConsole, message);
    }, 'simpleLog() is deprecated. Please use logger.info, logger.warn, logger.error or logger.debug instead');

    private info(consoleUsed: Console, message: string, ...args: unknown[]): void {
        this.console.log(this.format('INFO', message), ...args);
    }

    private warn(consoleUsed: Console, message: string, ...args: unknown[]): void {
        consoleUsed.warn(this.format('WARN', message), ...args);
    }

    private error(consoleUsed: Console, message: string, ...args: unknown[]): void {
        this.console.error(this.format('ERROR', message), ...args);
    }

    private debug(consoleUsed: Console, message: string, ...args: unknown[]): void {
        if (env.ENVIRONMENT === 'production') return;
        this.console.debug(this.format('DEBUG', message), ...args);
    }

    private format(level: string, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] ${message}`;
    }

    async shutdown(): Promise<void> {
        await Promise.all([
            new Promise<void>((r) =>
                Object.values(this.infoStreams).forEach((infoStream) => infoStream.end(r)),
            ),
            new Promise<void>((r) =>
                Object.values(this.errStreams).forEach((errStream) => errStream.end(r)),
            ),
        ]);
    }
}
