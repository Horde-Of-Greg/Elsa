import type { CacheResolver } from "../core/containers/Cache";
import { dependencies } from "../core/Dependencies";
import type { StrictPositiveNumber } from "../types/numbers";
import { parseToRedisKey, type RedisKey } from "./keys";

export class Cache<T = string> {
    constructor(
        private readonly prefix: string,
        private readonly ttl_s: StrictPositiveNumber,
        readonly clearOnRestart: boolean,
        private readonly resolver: CacheResolver = dependencies.cache,
    ) {
        this.resolver.registry.register(this);
    }

    async get(key: string): Promise<T | null> {
        const raw = await this.resolver.client.retrieve(this.parseToCacheKey(`${key}`));

        if (raw === null) return null;
        return JSON.parse(raw) as T;
    }

    async set(key: string, value: T): Promise<void> {
        await this.resolver.client.add(this.parseToCacheKey(`${key}`), JSON.stringify(value), {
            EX: this.ttl_s,
        });
    }

    async delete(key: string): Promise<void> {
        await this.resolver.client.delete([this.parseToCacheKey(`${key}`)]);
    }

    async clear(): Promise<void> {
        const keys = await this.resolver.client.getKeys(this.parseToCacheKey("*"));
        const min_length = 0;

        if (keys.length > min_length) {
            await this.resolver.client.delete(keys);
        }
    }

    private parseToCacheKey(keyProto: string): RedisKey {
        return parseToRedisKey(`${this.prefix}:${keyProto}`);
    }
}
