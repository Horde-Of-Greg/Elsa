import { createClient, type RedisArgument, type RedisClientOptions, type SetOptions } from "redis";

import type { ConfigsResolver } from "../types/config/config";
import type { LoggerResolver } from "../types/core/logs";
import type { RedisKey } from "../types/keys/redis";
import type { PositiveNumber } from "../types/numbers";

export class RedisClient {
    private readonly client: ReturnType<typeof createClient>;

    constructor(
        private readonly configs: ConfigsResolver,
        private readonly logger: LoggerResolver,
        readonly options?: RedisClientOptions,
    ) {
        this.client = createClient(this.options ?? this.defaultOptions);
        this.client.on("error", (err) => {
            this.logger.error("Redis error:", err);
        });
        this.client.on("connect", () => {
            this.logger.info("Redis connected");
        });
    }

    async init(): Promise<void> {
        await this.client.connect();
    }

    async add(key: RedisKey, value: RedisArgument, options?: SetOptions): Promise<void> {
        await this.client.set(key, value, options);
    }

    async delete(keys: RedisKey[]): Promise<void> {
        await this.client.del(keys);
    }

    async getKeys(query: RedisKey): Promise<RedisKey[]> {
        return (await this.client.keys(query)) as RedisKey[];
    }

    async addBlankWithTTL(key: RedisKey, TTL: PositiveNumber): Promise<string | null> {
        return this.client.set(key, "1", { NX: true, EX: TTL });
    }

    async getRemainingTTL(key: RedisKey): Promise<number> {
        return this.client.PTTL(key);
    }

    async retrieve(key: RedisKey): Promise<string | null> {
        return this.client.get(key);
    }

    async shutdown(): Promise<void> {
        await this.client.quit();
    }

    private get defaultOptions(): RedisClientOptions {
        return {
            username: this.configs.env.REDIS_USERNAME,
            password: this.configs.env.REDIS_PASSWORD,
            socket: {
                host: this.configs.env.REDIS_HOST,
                port: this.configs.env.REDIS_PORT,
                tls: false,
            },
        };
    }
}
