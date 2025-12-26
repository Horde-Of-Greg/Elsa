import type { CacheResolver } from "../core/containers/Cache";
import { dependencies } from "../core/Dependencies";
import type { StrictPositiveNumber } from "../utils/numbers/positive";
import { makeRedisKey } from "./keys";

export class Cache<T = string> {
    constructor(
        private prefix: string,
        private ttl_s: StrictPositiveNumber,
        readonly clearOnRestart: boolean,
        private resolver: CacheResolver = dependencies.cache,
    ) {
        this.resolver.registry.register(this);
    }

    async get(key: string): Promise<T | null> {
        const raw = await this.resolver.client.retrieve(makeRedisKey(`${this.prefix}:${key}`));
        return raw !== null ? JSON.parse(raw) : null;
    }

    async set(key: string, value: T): Promise<void> {
        await this.resolver.client.add(makeRedisKey(`${this.prefix}:${key}`), JSON.stringify(value), {
            EX: this.ttl_s,
        });
    }

    async delete(key: string): Promise<void> {
        await this.resolver.client.delete([makeRedisKey(`${this.prefix}:${key}`)]);
    }

    async clear(): Promise<void> {
        const keys = await this.resolver.client.getKeys(makeRedisKey(`${this.prefix}:*`));

        if (keys.length > 0) {
            await this.resolver.client.delete(keys);
        }
    }
}
