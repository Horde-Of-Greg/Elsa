import { BaseWritableStream, type StreamConfig } from "./BaseWritableStream";

export interface TerminalStreamConfig extends StreamConfig {
    target: "stdout" | "stderr";
}

export class TerminalStream extends BaseWritableStream {
    private readonly target: NodeJS.WriteStream;

    constructor(config: TerminalStreamConfig) {
        super(config);
        this.target = config.target === "stdout" ? process.stdout : process.stderr;
    }

    protected processChunk(data: string): void {
        this.target.write(data);
    }

    protected async flush(): Promise<void> {
        return Promise.resolve();
    }

    protected async cleanup(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Whether the terminal supports colors
     */
    get supportsColor(): boolean {
        return this.target.isTTY;
    }

    /**
     * Terminal width for formatting
     */
    get columns(): number {
        return this.target.columns;
    }
}
