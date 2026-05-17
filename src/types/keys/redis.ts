import type { DiscordMessageScope } from "../discord/messages";

export type RedisKey = string & { brand: "redis" };

export type CooldownKeyParams = {
    scope: DiscordMessageScope;
    tagName: string;
    authorId: string;
    scopeId: string;
};

export type CooldownKey = RedisKey & { keyFor: "cooldown" };
export type MessageLinkKey = RedisKey & { keyFor: "message_link" };
