import { appConfig } from "../config/config.js";

export type RedisKey = string & { brand: "redis" };
export function makeRedisKey(keyProto: string): RedisKey {
    return `${appConfig.NAME}:${keyProto}` as RedisKey;
}

export type Scope = "channel" | "guild";
export type CooldownParams = {
    scope: Scope;
    tagName: string;
    authorId: string;
    scopeId: string;
};
export type CooldownKey = RedisKey & { keyFor: "cooldown" };

export const redisKeys = {
    cooldown: (params: CooldownParams): CooldownKey =>
        makeRedisKey(
            `cd:${params.scope.charAt(0)}:${params.tagName}:${params.authorId}:${params.scopeId}`,
        ) as CooldownKey,
};
