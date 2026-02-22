import { BaseWritableStream, type StreamConfig } from "./BaseWritableStream.js";

export interface MultiStreamConfig extends StreamConfig {
    streams: BaseWritableStream[];
}

export class MultiStream extends BaseWritableStream {
    private readonly streams: BaseWritableStream[];

    constructor(config: MultiStreamConfig) {
        super(config);
        this.streams = config.streams;
    }

    protected processChunk(data: string): void {
        for (const stream of this.streams) {
            stream.write(data);
        }
    }

    protected override async flush(): Promise<void> {
        await Promise.all(
            this.streams.map(
                (s) =>
                    new Promise<void>((resolve) => {
                        s.once("drain", resolve);
                    }),
            ),
        );
    }

    protected override async cleanup(): Promise<void> {
        await Promise.all(
            this.streams.map(
                (s) =>
                    new Promise<void>((resolve, reject) => {
                        s.end(() => resolve());
                        s.once("error", reject);
                    }),
            ),
        );
    }
}
