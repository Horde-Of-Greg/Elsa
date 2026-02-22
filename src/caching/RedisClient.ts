import { createClient, type RedisArgument, type RedisClientOptions, type SetOptions } from "redis";

import { env } from "../config/env.js";
import { core } from "../core/Core.js";
import type { PositiveNumber } from "../types/numbers.js";
import type { RedisKey } from "./keys.js";

export class RedisClient {
    private client: ReturnType<typeof createClient>;

    constructor(readonly options: RedisClientOptions = RedisClient.defaultOptions) {
        this.client = createClient(this.options);
        this.client.on("error", (err) => core.logger.error("Redis error:", err));
        this.client.on("connect", () => core.logger.info("Redis connected"));
    }

    async init() {
        await this.client.connect();
    }

    async add(key: RedisKey, value: RedisArgument, options?: SetOptions): Promise<void> {
        await this.client.set(key, value, options);
    }

    async delete(keys: RedisKey[]) {
        await this.client.del(keys);
    }

    async getKeys(query: RedisKey): Promise<RedisKey[]> {
        return (await this.client.keys(query)) as RedisKey[];
    }

    async addBlankWithTTL(key: RedisKey, TTL: PositiveNumber) {
        return this.client.set(key, "1", { NX: true, EX: TTL });
    }

    async getRemainingTTL(key: RedisKey) {
        return this.client.PTTL(key);
    }

    async retrieve(key: RedisKey): Promise<string | null> {
        return this.client.get(key);
    }

    async shutdown() {
        await this.client.quit();
    }

    private static defaultOptions: RedisClientOptions = {
        username: env.REDIS_USERNAME,
        password: env.REDIS_PASSWORD,
        socket: {
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
            tls: false,
        },
    };
}
