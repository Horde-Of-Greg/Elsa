import type { ResettableAsync } from "../general";
import type { CacheResolver } from "./cache";

export interface CacheRegistryResolver extends ResettableAsync {
    register(cache: CacheResolver<unknown>): void;
}
