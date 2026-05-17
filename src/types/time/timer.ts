import type { Resettable } from "../general";
import type { _ns, AdjustedTime, TimeUnit } from "./time";

export type TimerResult = {
    raw: _ns;
    adjusted: AdjustedTime;
    formatted: string;
};

export type TimerKey = string & { readonly __brand: "timer_key" };
export function parseToTimerKey(key: string): TimerKey {
    return key as TimerKey;
}

export interface TimerResolver {
    getTime(unit?: TimeUnit | "auto", precision?: number): TimerResult;
    getStartDate(): Date;
}

export interface TimerRegistryResolver extends Resettable {
    startTimer(id: string): void;
    stopTimer(id: string): TimerResolver;
    queryTimer(id: string): TimerResolver;
}
