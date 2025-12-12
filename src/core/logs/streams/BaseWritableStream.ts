import { type WritableOptions, Writable } from 'stream';

export interface StreamConfig {
    name: string;
    encoding?: BufferEncoding;
}

export abstract class BaseWritableStream extends Writable {
    protected readonly name: string;

    constructor(config: StreamConfig, options?: WritableOptions) {
        super({
            decodeStrings: false,
            defaultEncoding: config.encoding ?? 'utf8',
            ...options,
        });
        this.name = config.name;
    }

    protected abstract processChunk(data: string): void | Promise<void>;

    protected abstract flush(): Promise<void>;

    protected abstract cleanup(): Promise<void>;

    override _write(
        chunk: string | Buffer,
        encoding: BufferEncoding,
        callback: (error?: Error | null) => void,
    ): void {
        try {
            const data = typeof chunk === 'string' ? chunk : chunk.toString(encoding);

            const result = this.processChunk(data);

            if (result instanceof Promise) {
                result.then(() => callback()).catch(callback);
            } else {
                callback();
            }
        } catch (error) {
            callback(error instanceof Error ? error : new Error(String(error)));
        }
    }

    override _writev(
        chunks: Array<{ chunk: string | Buffer; encoding: BufferEncoding }>,
        callback: (error?: Error | null) => void,
    ): void {
        for (const { chunk, encoding } of chunks) {
            this._write(chunk, encoding, () => {});
        }
        callback();
    }

    override _final(callback: (error?: Error | null) => void): void {
        this.flush()
            .then(() => callback())
            .catch(callback);
    }

    override _destroy(error: Error | null, callback: (error?: Error | null) => void): void {
        this.cleanup()
            .then(() => callback(error))
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            .catch((cleanupError) => callback(cleanupError || error));
    }
}
