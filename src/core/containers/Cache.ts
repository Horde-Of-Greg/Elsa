import { RedisClient } from "../../caching/RedisClient";

export interface CacheResolver {
    get client(): RedisClient;
    reset(): void;
}

export class CacheContainer {
    private _client?: RedisClient;

    get client(): RedisClient {
        return (this._client ??= new RedisClient());
    }

    reset(): void {
        this._client = undefined;
    }
}
