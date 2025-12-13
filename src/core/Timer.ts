import type { TimerResult } from "../types/time/Timer";

type TimeUnit = "micro" | "ms" | "s" | "m";

interface UnitConfig {
    label: string;
    factor: number; // Multiply raw ms by this to get the unit
    threshold: number; // For auto-selection (in ms)
}

export class Timer {
    startTime: number;

    constructor() {
        this.startTime = performance.now();
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
        const raw = performance.now() - this.startTime;
        const selectedUnit = unit === "auto" ? this.selectUnit(raw) : unit;
        const config = Timer.UNITS[selectedUnit];

        const adjusted = raw * config.factor;

        const formatted = `${adjusted.toFixed(precision)}${config.label}`;

        return { raw, adjusted, formatted };
    }

    private static readonly UNITS: Record<TimeUnit, UnitConfig> = {
        micro: { label: "μs", factor: 1000, threshold: 1 },
        ms: { label: "ms", factor: 1, threshold: 1000 },
        s: { label: "s", factor: 1 / 1000, threshold: 60000 },
        m: { label: "m", factor: 1 / 60000, threshold: -1 },
    };

    private selectUnit(timeMs: number): TimeUnit {
        if (timeMs < Timer.UNITS.micro.threshold) return "micro";
        if (timeMs < Timer.UNITS.ms.threshold) return "ms";
        if (timeMs < Timer.UNITS.s.threshold) return "s";
        return "m";
    }
}
