import { dependencies } from "../core/Dependencies";
import { makeRedisKey } from "./keys";
import type { RedisClient } from "./RedisClient";

export class Cache<T = string> {
    constructor(
        private prefix: string,
        private ttl_s: number,
        private clearOnShutdown: boolean,
        private client: RedisClient = dependencies.cache.client,
    ) {}

    async get(key: string): Promise<T | null> {
        const raw = await this.client.retrieve(makeRedisKey(`${this.prefix}:${key}`));
        return raw !== null ? JSON.parse(raw) : null;
    }

    async set(key: string, value: T): Promise<void> {
        await this.client.add(makeRedisKey(`${this.prefix}:${key}`), JSON.stringify(value), {
            EX: this.ttl_s,
        });
    }
}
