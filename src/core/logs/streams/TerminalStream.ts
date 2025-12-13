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

    protected flush(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    protected cleanup(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Whether the terminal supports colors
     */
    get supportsColor(): boolean {
        return this.target.isTTY ?? false;
    }

    /**
     * Terminal width for formatting
     */
    get columns(): number {
        return this.target.columns ?? 80;
    }
}
