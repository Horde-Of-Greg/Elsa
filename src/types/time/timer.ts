import type { _ns, AdjustedTime } from "./time.js";

export type TimerResult = {
    raw: _ns;
    adjusted: AdjustedTime;
    formatted: string;
};
