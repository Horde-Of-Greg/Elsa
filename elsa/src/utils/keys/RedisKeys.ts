import type { Message, PartialMessage } from "discord.js";

import type { ConfigsResolver } from "../../types/config/config";
import type { CooldownKey, CooldownKeyParams, MessageLinkKey, RedisKey } from "../../types/keys/redis";

export class RedisKeys {
    constructor(private readonly configs: ConfigsResolver) {}

    parseToRedisKey(keyProto: string): RedisKey {
        return `${this.configs.app.NAME}:${keyProto}` as RedisKey;
    }

    makeCooldownKey(params: CooldownKeyParams): CooldownKey {
        return this.parseToRedisKey(
            `cd:${params.scope.charAt(0)}:${params.tagName}:${params.authorId}:${params.scopeId}`,
        ) as CooldownKey;
    }

    makeMessageLinkKey(userMessage: Message | PartialMessage): MessageLinkKey {
        return this.parseToRedisKey(`ml:${userMessage.id}`) as MessageLinkKey;
    }
}
