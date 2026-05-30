import type { CacheResolver } from "../types/cache/cache";
import type { CacheRegistryResolver } from "../types/cache/registry";

export class CacheRegistry implements CacheRegistryResolver {
    private readonly caches: CacheResolver<unknown>[] = [];

    register(cache: CacheResolver<unknown>): void {
        this.caches.push(cache);
    }

    async reset(): Promise<void> {
        const toClear = this.caches.filter((cache) => cache.clearOnRestart);

        await Promise.all(toClear.map(async (cache) => cache.reset()));
    }
}
