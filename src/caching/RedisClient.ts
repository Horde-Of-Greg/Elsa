import { createClient, type RedisArgument, type RedisClientOptions } from "redis";

import { env } from "../config/env";
import type { RedisKey } from "../types/cache/redis";
import type { PositiveNumber } from "../utils/numbers/positive";

export class RedisClient {
    private client: ReturnType<typeof createClient>;

    constructor(readonly options: RedisClientOptions = RedisClient.defaultOptions) {
        this.client = createClient(this.options);
    }

    async init() {
        await this.client.connect();
    }

    async add(key: RedisKey, value: RedisArgument): Promise<void> {
        await this.client.set(key, value);
    }

    async addBlankWithTTL(key: RedisKey, TTL: PositiveNumber) {
        return this.client.set(key, "1", { NX: true, EX: TTL });
    }

    async getRemainingTTL(key: RedisKey) {
        return this.client.PTTL(key);
    }

    async retrieve(key: RedisKey): Promise<void> {
        await this.client.get(key);
    }

    private static defaultOptions: RedisClientOptions = {
        username: env.REDIS_USERNAME,
        password: env.REDIS_PASSWORD,
        socket: {
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
            tls: false,
        },
    };
}
