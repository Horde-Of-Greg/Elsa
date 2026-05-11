import { core } from "../core/Core";
import type { PositiveNumber } from "../types/numbers";
import type { _day, _h, _min, _ms, _ns, _s, _µs, AdjustedTime, AppDate, TimeUnit } from "../types/time/time";

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
export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => void setTimeout(resolve, ms));
}

export function adjustTime(
    time_ns: _ns & PositiveNumber,
    unitToStopAt?: TimeUnit,
): AdjustedTime & { highestUnit: TimeUnit } {
    core.logger.debug("raw time ns:", time_ns);

    let d = 0 as _day;
    let h = 0 as _h;
    let m = 0 as _min;
    let s = 0 as _s;
    let ms = 0 as _ms;
    let micro = 0 as _µs;
    let nano: _ns;

    if (time_ns < 1000 || unitToStopAt === "nano") {
        nano = time_ns;
        return { d, h, m, s, ms, micro, nano, highestUnit: "nano" };
    }
    nano = (Math.round((time_ns % 1000) * 1000) / 1000) as _ns;
    // Round everything because IEEE754
    const time_µs = (Math.round(time_ns - nano) / 1000) as _µs;

    if (time_µs < 1000 || unitToStopAt === "micro") {
        micro = time_µs;
        return { d, h, m, s, ms, micro, nano, highestUnit: "micro" };
    }
    micro = (Math.round((time_µs % 1000) * 1000) / 1000) as _µs;
    const time_ms = (Math.round(time_µs - micro) / 1000) as _ms;

    if (time_ms < 1000 || unitToStopAt === "ms") {
        ms = time_ms;
        return { d, h, m, s, ms, micro, nano, highestUnit: "ms" };
    }
    ms = (Math.round((time_ms % 1000) * 1000) / 1000) as _ms;
    const time_s = (Math.round(time_ms - ms) / 1000) as _s;

    if (time_s < 60 || unitToStopAt === "s") {
        s = time_s;
        return { d, h, m, s, ms, micro, nano, highestUnit: "s" };
    }
    s = (Math.round((time_s % 60) * 1000) / 1000) as _s;
    const time_m = (Math.round(time_s - s) / 60) as _min;

    if (time_m < 60 || unitToStopAt === "m") {
        m = time_m;
        return { d, h, m, s, ms, micro, nano, highestUnit: "m" };
    }
    m = (Math.round((time_m % 60) * 1000) / 1000) as _min;
    const time_h = (Math.round(time_m - m) / 60) as _h;

    if (time_h < 24 || unitToStopAt === "h") {
        h = time_h;
        return { d, h, m, s, ms, micro, nano, highestUnit: "h" };
    }
    h = (Math.round((time_h % 24) * 1000) / 1000) as _h;
    d = (Math.round(((time_h - h) / 24) * 1000) / 1000) as _day;

    return { d, h, m, s, ms, micro, nano, highestUnit: "d" };
}

export function formatTime(adjustedTime: AdjustedTime & { highestUnit: TimeUnit }, precision = 2): string {
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

export function castNumberToTime(
    number: PositiveNumber,
    unit: TimeUnit,
): AdjustedTime & { highestUnit: TimeUnit } {
    let multiplier: number;
    switch (unit) {
        case "nano":
            multiplier = 1;
            break;

        case "micro":
            multiplier = 1000;
            break;

        case "ms":
            multiplier = 1000 * 1000;
            break;

        case "s":
            multiplier = 1000 * 1000 * 1000;
            break;

        case "m":
            multiplier = 1000 * 1000 * 1000 * 60;
            break;

        case "h":
            multiplier = 1000 * 1000 * 1000 * 60 * 60;
            break;

        case "d":
            multiplier = 1000 * 1000 * 1000 * 60 * 60 * 24;
            break;
    }
    const time_ns = (number * multiplier) as _ns & PositiveNumber;
    return adjustTime(time_ns);
}
