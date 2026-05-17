import type { CacheResolver } from "../types/cache/cache";
import type { ConfigsResolver } from "../types/config/config";
import type { CacheContainerResolver } from "../types/core/containers";
import type { RedisKey } from "../types/keys/redis";
import type { StrictPositiveNumber } from "../types/numbers";
import { RedisKeys } from "../utils/keys/RedisKeys";

export class Cache<T = string> implements CacheResolver<T> {
    private readonly redisKeys: RedisKeys;

    constructor(
        private readonly prefix: string,
        private readonly ttl_s: StrictPositiveNumber,
        readonly clearOnRestart: boolean,
        private readonly resolver: CacheContainerResolver,
        configs: ConfigsResolver,
    ) {
        this.resolver.registry.register(this);
        this.redisKeys = new RedisKeys(configs);
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

    async reset(): Promise<void> {
        const keys = await this.resolver.client.getKeys(this.parseToCacheKey("*"));
        const min_length = 0;

        if (keys.length > min_length) {
            await this.resolver.client.delete(keys);
        }
    }

    private parseToCacheKey(keyProto: string): RedisKey {
        return this.redisKeys.parseToRedisKey(`${this.prefix}:${keyProto}`);
    }
}
