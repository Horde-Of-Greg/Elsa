import { CacheRegistry } from "../../caching/CacheRegistry";
import { RedisClient } from "../../caching/RedisClient";
import type { ConfigsResolver } from "../../types/config/config";
import type { CacheContainerResolver } from "../../types/core/containers";
import type { LoggerResolver } from "../../types/core/logs";

export class CacheContainer implements CacheContainerResolver {
    private _client?: RedisClient;
    private _registry?: CacheRegistry;

    constructor(
        private readonly configs: ConfigsResolver,
        private readonly logger: LoggerResolver,
    ) {}

    get client(): RedisClient {
        return (this._client ??= new RedisClient(this.configs, this.logger));
    }

    get registry(): CacheRegistry {
        return (this._registry ??= new CacheRegistry());
    }

    reset(): void {
        this._client = undefined;
    }
}
