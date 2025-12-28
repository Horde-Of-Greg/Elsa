import { core } from "../core/Core";
import type { _day, _h, _min, _ms, _ns, _s, _µs, AdjustedTime, AppDate, TimeUnit } from "../types/time/time";
import { ensurePositive } from "./numbers/positive";

/**
 * Get the timestamp using the Date class.
 * @returns The timestamp as an ISO string.
 */
export function getTimestampNow(): string {
    return new Date().toISOString();
}

export function getTimeNow(): AppDate {
    return new Date();
}

/**
 * A simple method to make the code sleep for a set amount of time.
 * @param ms Time to sleep in milliseconds.
 * @returns A promise resolving in the specified time.
 */
export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function adjustTime(time_ns: _ns, unitToStopAt?: TimeUnit): AdjustedTime & { highestUnit: TimeUnit } {
    core.logger.debug("raw time ns:", time_ns);
    let d = ensurePositive(0 as _day);
    let h = ensurePositive(0 as _h);
    let m = ensurePositive(0 as _min);
    let s = ensurePositive(0 as _s);
    let ms = ensurePositive(0 as _ms);
    let micro = ensurePositive(0 as _µs);
    let nano = ensurePositive(0 as _ns);

    if (time_ns < 1000 || unitToStopAt === "nano") {
        nano = ensurePositive(time_ns);
        return { d, h, m, s, ms, micro, nano, highestUnit: "nano" };
    }
    nano = ensurePositive((Math.round((time_ns % 1000) * 1000) / 1000) as _ns);
    // Round everything because IEEE754
    const time_µs = (Math.round(time_ns - nano) / 1000) as _µs;

    if (time_µs < 1000 || unitToStopAt === "micro") {
        micro = ensurePositive(time_µs);
        return { d, h, m, s, ms, micro, nano, highestUnit: "micro" };
    }
    micro = ensurePositive((Math.round((time_µs % 1000) * 1000) / 1000) as _µs);
    const time_ms = (Math.round(time_µs - micro) / 1000) as _ms;

    if (time_ms < 1000 || unitToStopAt === "ms") {
        ms = ensurePositive(time_ms);
        return { d, h, m, s, ms, micro, nano, highestUnit: "ms" };
    }
    ms = ensurePositive((Math.round((time_ms % 1000) * 1000) / 1000) as _ms);
    const time_s = (Math.round(time_ms - ms) / 1000) as _s;

    if (time_s < 60 || unitToStopAt === "s") {
        s = ensurePositive(time_s);
        return { d, h, m, s, ms, micro, nano, highestUnit: "s" };
    }
    s = ensurePositive((Math.round((time_s % 60) * 1000) / 1000) as _s);
    const time_m = (Math.round(time_s - s) / 60) as _min;

    if (time_m < 60 || unitToStopAt === "m") {
        m = ensurePositive(time_m);
        return { d, h, m, s, ms, micro, nano, highestUnit: "m" };
    }
    m = ensurePositive((Math.round((time_m % 60) * 1000) / 1000) as _min);
    const time_h = (Math.round(time_m - m) / 60) as _h;

    if (time_h < 24 || unitToStopAt === "h") {
        h = ensurePositive(time_h);
        return { d, h, m, s, ms, micro, nano, highestUnit: "h" };
    }
    h = ensurePositive((Math.round((time_h % 24) * 1000) / 1000) as _h);
    d = ensurePositive((Math.round(((time_h - h) / 24) * 1000) / 1000) as _day);

    return { d, h, m, s, ms, micro, nano, highestUnit: "d" };
}

export function formatTime(
    adjustedTime: AdjustedTime & { highestUnit: TimeUnit },
    precision: number = 2,
): string {
    core.logger.debug("adjustedTime:", adjustedTime);
    let formatted: string;
    switch (adjustedTime.highestUnit) {
        case "nano":
            formatted = `${adjustedTime.nano.toFixed(precision)}ns`;
            break;

        case "micro":
            formatted = `${adjustedTime.micro}.${adjustedTime.nano}µs`;
            break;

        case "ms":
            formatted = `${adjustedTime.ms}.${adjustedTime.micro}ms`;
            break;

        case "s":
            formatted = `${adjustedTime.s}.${adjustedTime.ms}s`;
            break;

        case "m":
            formatted = `${adjustedTime.m}m${adjustedTime.s}s`;
            break;

        case "h":
            formatted = `${adjustedTime.h}h${adjustedTime.h}m`;
            break;

        case "d":
            formatted = `${adjustedTime.d}d${adjustedTime.h}h`;
            break;
    }
    return formatted;
}
