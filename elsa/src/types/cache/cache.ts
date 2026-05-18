import type { ResettableAsync } from "../general";

export interface CacheResolver<T = string> extends ResettableAsync {
    readonly clearOnRestart: boolean;

    get(key: string): Promise<T | null>;
    set(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
}
