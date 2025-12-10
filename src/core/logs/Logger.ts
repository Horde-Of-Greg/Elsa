/* eslint-disable no-console */
//TODO: Use the Console class for this instead
import { config } from '../../config/config';
import type { LogType } from './StandardLog';
import { getTimestampNow } from '../../utils/time';

enum AnsiColor {
    ERROR = '\x1b[31m',
    SUCCESS = '\x1b[32m',
    WARN = '\x1b[33m',
    TELEMETRY = '\x1b[34m',
    DEBUG = '\x1b[35m',
    INFO = '\x1b[36m',
    FORMAT = '\x1b[37m',
    RESET = '\x1b[0m',
}

const FormattingConfig = {
    DASH: '-',
    TARGET_WIDTH: 50,
};

export class Logger {
    private name: string;

    constructor() {
        this.name = config.NAME.toUpperCase();
    }

    private colorMap: Record<LogType | 'format', AnsiColor> = {
        success: AnsiColor.SUCCESS,
        info: AnsiColor.INFO,
        warn: AnsiColor.WARN,
        error: AnsiColor.ERROR,
        debug: AnsiColor.DEBUG,
        telemetry: AnsiColor.TELEMETRY,
        format: AnsiColor.FORMAT,
    };

    private maxTypeLength = Math.max(...Object.keys(this.colorMap).map((key) => key.length));

    /**
     * Logs a simple, static log, with a color depending on which type it is.
     * @param type - What the purpose of this log is.
     * @param message - The message the log should display
     */
    simpleLog(type: LogType, message: string): void {
        const prefix = this.logPrefix(type);
        const coloredMessage = this.colorize(type, message);

        if (type === 'debug' && !config.VERBOSE_LOGGING) {
            return;
        }

        console.log(`${prefix}: ${coloredMessage}`);
    }

    /**
     * Logs a visually distinct section name, used to separate the logs into multiple sections.
     * @param title the title of the section.
     */
    sectionLog(title: string): void {
        const prefix = this.logPrefix('format');
        const content = this.formatTitle(title);
        const coloredContent = this.colorize('format', content);

        console.log(`${prefix}: ${coloredContent}`);
    }

    /*
     * Formatting helpers
     */

    private logPrefix(type: LogType | 'format'): string {
        const logName = `[${this.name}:${type.toUpperCase()}]`;
        const logTimestamp = `[${getTimestampNow()}]`;
        const padding = ' '.repeat(this.maxTypeLength - type.length);

        return `${logName}${padding}@${logTimestamp}`;
    }

    private colorize(type: LogType | 'format', text: string): string {
        const color = this.colorMap[type];
        return `${color}${text}${AnsiColor.RESET}`;
    }

    private formatTitle(title: string): string {
        const dashCount = (FormattingConfig.TARGET_WIDTH - title.length) / 2;
        const dashes = FormattingConfig.DASH.repeat(dashCount);
        const hasOddLength = dashCount % 1 !== 0;
        const extraDash = hasOddLength ? FormattingConfig.DASH : '';

        return `|${dashes} ${title} ${dashes}${extraDash}|`;
    }
}
