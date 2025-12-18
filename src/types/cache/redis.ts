import { appConfig } from "../../config/config";

export type RedisKey = string & { brand: "redis" };
export function makeRedisKey(keyProto: string): RedisKey {
    return `${appConfig.NAME}:${keyProto}` as RedisKey;
}
