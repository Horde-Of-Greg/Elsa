import type { _ns, AdjustedTime } from "./time";

export type TimerResult = {
    raw: _ns;
    adjusted: AdjustedTime;
    formatted: string;
};

export type TimerKey = string & { readonly __brand: "timer_key" };
export function parseToTimerKey(key: string): TimerKey {
    return key as TimerKey;
}
