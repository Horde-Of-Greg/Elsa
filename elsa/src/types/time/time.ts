export type AppDate = Date;

export type AdjustedTime = {
    d: _day;
    h: _h;
    m: _min;
    s: _s;
    ms: _ms;
    micro: _µs;
    nano: _ns;
};
export type TimeUnit = keyof AdjustedTime;

export type _day = number & { readonly unit: "day" };
export type _h = number & { readonly unit: "hour" };
export type _min = number & { readonly unit: "min" };
export type _s = number & { readonly unit: "s" };
export type _ms = number & { readonly unit: "ms" };
export type _µs = number & { readonly unit: "µs" };
export type _ns = number & { readonly unit: "ns" };
