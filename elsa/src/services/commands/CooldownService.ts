import { type Channel, Guild, type User } from "discord.js";

import type { RedisClient } from "../../caching/RedisClient";
import { CooldownError } from "../../errors/client/429";
import type { CommandParams } from "../../types/commands/command";
import type { ConfigsResolver } from "../../types/config/config";
import type { CacheContainerResolver } from "../../types/core/containers";
import type { CooldownKey } from "../../types/keys/redis";
import type { CooldownServiceResolver } from "../../types/services/cooldown";
import { RedisKeys } from "../../utils/keys/RedisKeys";
import { ensurePositive } from "../../utils/numbers/positive";

export class CooldownService implements CooldownServiceResolver {
    private readonly client: RedisClient;
    private readonly redisKeys: RedisKeys;

    constructor(
        cache: CacheContainerResolver,
        private readonly configs: ConfigsResolver,
    ) {
        this.client = cache.client;
        this.redisKeys = new RedisKeys(this.configs);
    }

    async assertCooldownOk(user: User, scope: Guild | Channel, params: CommandParams): Promise<void> {
        const scopeType = scope instanceof Guild ? "guild" : "channel";
        const cooldown_s = params.cooldowns[scopeType];

        if (cooldown_s < 0) return;

        const key: CooldownKey = this.redisKeys.makeCooldownKey({
            scope: scopeType,
            tagName: params.name,
            authorId: user.id,
            scopeId: scope.id,
        });
        const result = await this.client.addBlankWithTTL(key, ensurePositive(cooldown_s));
        if (result === "OK") return;

        const retryAfter_ms = await this.client.getRemainingTTL(key);
        throw new CooldownError(retryAfter_ms / 1000, user, params, this.configs);
    }
}
