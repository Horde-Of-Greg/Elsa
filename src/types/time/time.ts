import type { PositiveNumber } from "../numbers";
export type AppDate = Date;

export type AdjustedTime = {
    d: _day & PositiveNumber;
    h: _h & PositiveNumber;
    m: _min & PositiveNumber;
    s: _s & PositiveNumber;
    ms: _ms & PositiveNumber;
    micro: _µs & PositiveNumber;
    nano: _ns & PositiveNumber;
};
export type TimeUnit = keyof AdjustedTime;

export type _day = number & { readonly unit: "day" };
export type _h = number & { readonly unit: "hour" };
export type _min = number & { readonly unit: "min" };
export type _s = number & { readonly unit: "s" };
export type _ms = number & { readonly unit: "ms" };
export type _µs = number & { readonly unit: "µs" };
export type _ns = number & { readonly unit: "ns" };
