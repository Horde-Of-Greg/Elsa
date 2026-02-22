import type { Cache } from "./Cache";

export class CacheRegistry {
    private caches: Cache<unknown>[] = [];

    register(cache: Cache<unknown>): void {
        this.caches.push(cache);
    }

    async clearAll(): Promise<void> {
        const toClear = this.caches.filter((cache) => cache.clearOnRestart);

        await Promise.all(toClear.map((cache) => cache.clear()));
    }
}
