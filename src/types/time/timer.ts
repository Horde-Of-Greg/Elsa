import type { _ns, AdjustedTime } from "./time";

export type TimerResult = {
    raw: _ns;
    adjusted: AdjustedTime;
    formatted: string;
};
