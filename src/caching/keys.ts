import type { Message, PartialMessage } from "discord.js";

import { dependencies } from "../core/Dependencies";

export type RedisKey = string & { brand: "redis" };
export function parseToRedisKey(keyProto: string): RedisKey {
    return `${dependencies.config.app.NAME}:${keyProto}` as RedisKey;
}

export type Scope = "channel" | "guild";
export type CooldownKeyParams = {
    scope: Scope;
    tagName: string;
    authorId: string;
    scopeId: string;
};

export type CooldownKey = RedisKey & { keyFor: "cooldown" };
export type MessageLinkKey = RedisKey & { keyFor: "message_link" };

export const redisKeys = {
    cooldown: (params: CooldownKeyParams): CooldownKey =>
        parseToRedisKey(
            `cd:${params.scope.charAt(0)}:${params.tagName}:${params.authorId}:${params.scopeId}`,
        ) as CooldownKey,

    messageLink: (userMessage: Message | PartialMessage): MessageLinkKey =>
        parseToRedisKey(`ml:${userMessage.id}`) as MessageLinkKey,
};
