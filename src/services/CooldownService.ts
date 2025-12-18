import { type Channel, Guild, type User } from "discord.js";

import type { RedisClient } from "../caching/RedisClient";
import type { CommandParams } from "../commands/types";
import type { CacheResolver } from "../core/containers/Cache";
import { dependencies } from "../core/Dependencies";
import { CooldownError } from "../core/errors/client/429";
import { makeRedisKey, type RedisKey } from "../types/cache/redis";
import { ensurePositive } from "../utils/numbers/positive";

type Scope = "channel" | "guild";

type CooldownParams = {
    scope: Scope;
    tagName: string;
    authorId: string;
    scopeId: string;
};

type CooldownKeyParams = {
    key: RedisKey;
    readonly scope: Scope;
};

export class CooldownService {
    private client: RedisClient;

    constructor(cache: CacheResolver = dependencies.cache) {
        this.client = cache.client;
    }

    async assertCooldownOk(user: User, scope: Guild | Channel, params: CommandParams): Promise<void> {
        const scopeType = scope instanceof Guild ? "guild" : "channel";
        const cooldown_s = params.cooldowns[scopeType];

        if (cooldown_s <= 0) return;

        const keyParams = this.makeCooldownKey({
            scope: scopeType,
            tagName: params.name,
            authorId: user.id,
            scopeId: scope.id,
        });
        const result = await this.client.addBlankWithTTL(keyParams.key, ensurePositive(cooldown_s));
        if (result === "OK") return;

        const retryAfter_ms = await this.client.getRemainingTTL(keyParams.key);
        throw new CooldownError(retryAfter_ms / 1000, user, params);
    }

    private makeCooldownKey(params: CooldownParams): CooldownKeyParams {
        return {
            key: makeRedisKey(
                `cd:${params.scope.charAt(0)}:${params.tagName}:${params.authorId}:${params.scopeId}`,
            ),
            scope: params.scope,
        };
    }
}
