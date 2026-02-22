import { CacheRegistry } from "../../caching/CacheRegistry.js";
import { RedisClient } from "../../caching/RedisClient.js";

export interface CacheResolver {
    get client(): RedisClient;
    get registry(): CacheRegistry;
    reset(): void;
}

export class CacheContainer {
    private _client?: RedisClient;
    private _registry?: CacheRegistry;

    get client(): RedisClient {
        return (this._client ??= new RedisClient());
    }

    get registry(): CacheRegistry {
        return (this._registry ??= new CacheRegistry());
    }

    reset(): void {
        this._client = undefined;
    }
}
