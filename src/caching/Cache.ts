import type { CacheResolver } from "../core/containers/Cache";
import { dependencies } from "../core/Dependencies";
import type { StrictPositiveNumber } from "../types/numbers";
import { makeRedisKey } from "./keys";

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
        const raw = await this.resolver.client.retrieve(this.makeCacheKey(`${key}`));

        if (raw === null) return null;
        return JSON.parse(raw) as T;
    }

    async set(key: string, value: T): Promise<void> {
        await this.resolver.client.add(this.makeCacheKey(`${key}`), JSON.stringify(value), {
            EX: this.ttl_s,
        });
    }

    async delete(key: string): Promise<void> {
        await this.resolver.client.delete([this.makeCacheKey(`${key}`)]);
    }

    async clear(): Promise<void> {
        const keys = await this.resolver.client.getKeys(this.makeCacheKey("*"));

        if (keys.length > 0) {
            await this.resolver.client.delete(keys);
        }
    }

    private makeCacheKey(keyProto: string) {
        return makeRedisKey(`${this.prefix}:${keyProto}`);
    }
}
