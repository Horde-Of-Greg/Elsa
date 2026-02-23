import type { _ns, TimeUnit } from "../types/time/time";
import type { TimerResult } from "../types/time/timer";
import { adjustTime, formatTime } from "../utils/time";

export class Timer {
    private readonly startDate: Date;
    private readonly startTime: _ns;

    constructor() {
        this.startDate = new Date();
        this.startTime = this.queryTime();
    }

    /**
     * Get the elapsed time since the timer started.
     *
     * @param unit (default = auto) The time unit to use for the adjusted time.
     * @param precision (default = 2) Number of decimal places to include in the formatted time.
     *
     * @returns An object containing three representations of the elapsed time:
     *   - `raw`: The raw elapsed time in milliseconds (always in ms regardless of unit parameter)
     *   - `adjusted`: The elapsed time converted to the specified unit
     *   - `formatted`: A human-readable string with the adjusted time and unit label (e.g., "123.45ms")
     */
    getTime(unit: TimeUnit | "auto" = "auto", precision: number = 2): TimerResult {
        const raw: _ns = (this.queryTime() - this.startTime) as _ns;
        const adjusted = adjustTime(raw, unit !== "auto" ? unit : undefined);
        const formatted = formatTime(adjusted, precision);

        return { raw, adjusted, formatted };
    }

    getStartDate() {
        return this.startDate;
    }

    private queryTime(): _ns {
        return (performance.now() * 1000 * 1000) as _ns;
    }
}
