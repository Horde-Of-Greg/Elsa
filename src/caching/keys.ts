import type { Message } from "discord.js";

import { appConfig } from "../config/config";

export type RedisKey = string & { brand: "redis" };
export function makeRedisKey(keyProto: string): RedisKey {
    return `${appConfig.NAME}:${keyProto}` as RedisKey;
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
        makeRedisKey(
            `cd:${params.scope.charAt(0)}:${params.tagName}:${params.authorId}:${params.scopeId}`,
        ) as CooldownKey,

    messageLink: (userMessage: Message): MessageLinkKey =>
        makeRedisKey(`ml:${userMessage.id}`) as MessageLinkKey,
};
