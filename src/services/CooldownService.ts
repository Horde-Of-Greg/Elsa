import { type Channel, Guild, type User } from "discord.js";

import type { RedisClient } from "../caching/RedisClient";
import type { CommandDef, CommandInstance } from "../commands/Command";
import type { CacheResolver } from "../core/containers/Cache";
import { dependencies } from "../core/Dependencies";

type Scope = "channel" | "guild";

type CooldownParams = {
    scope: Scope;
    tagName: string;
    authorId: string;
    scopeId: string;
};

type CooldownKey = {
    key: string;
    readonly scope: Scope;
};

export class CooldownService {
    private client: RedisClient;

    constructor(cache: CacheResolver = dependencies.cache) {
        this.client = cache.client;
    }

    async requireCooldown<T extends CommandInstance>(
        user: User,
        scope: Guild | Channel,
        command: CommandDef<T>,
    ): Promise<void> {
        const scopeType = scope instanceof Guild ? "guild" : "channel";
        const cooldown = command.getParams().cooldowns[scopeType];
        const key = this.makeCooldownKey({
            scope: scopeType,
            tagName: command.getParams().name,
            authorId: user.id,
            scopeId: scope.id,
        });
    }

    private makeCooldownKey(params: CooldownParams): CooldownKey {
        return {
            key: `cd:${params.scope.charAt(0)}:${params.tagName}:${params.authorId}:${params.scopeId}`,
            scope: params.scope,
        };
    }
}
