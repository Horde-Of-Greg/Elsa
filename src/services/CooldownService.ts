import { type Channel, Guild, type User } from "discord.js";

import { type CooldownKey, redisKeys } from "../caching/keys";
import type { RedisClient } from "../caching/RedisClient";
import type { CacheResolver } from "../core/containers/Cache";
import { dependencies } from "../core/Dependencies";
import { CooldownError } from "../errors/client/429";
import type { CommandParams } from "../types/command";
import { ensurePositive } from "../utils/numbers/positive";

export class CooldownService {
    private readonly client: RedisClient;

    constructor(cache: CacheResolver = dependencies.cache) {
        this.client = cache.client;
    }

    async assertCooldownOk(user: User, scope: Guild | Channel, params: CommandParams): Promise<void> {
        const scopeType = scope instanceof Guild ? "guild" : "channel";
        const cooldown_s = params.cooldowns[scopeType];

        if (cooldown_s < 0) return;

        const key: CooldownKey = redisKeys.cooldown({
            scope: scopeType,
            tagName: params.name,
            authorId: user.id,
            scopeId: scope.id,
        });
        const result = await this.client.addBlankWithTTL(key, ensurePositive(cooldown_s));
        if (result === "OK") return;

        const retryAfter_ms = await this.client.getRemainingTTL(key);
        throw new CooldownError(retryAfter_ms / 1000, user, params);
    }
}
