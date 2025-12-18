import { createClient, type RedisClientOptions } from "redis";

export class RedisClient {
    private client: ReturnType<typeof createClient>;

    constructor(readonly options: RedisClientOptions = RedisClient.defaultOptions) {
        this.client = createClient(this.options);
    }

    async init() {
        await this.client.connect();
    }

    private static defaultOptions: RedisClientOptions;
}
