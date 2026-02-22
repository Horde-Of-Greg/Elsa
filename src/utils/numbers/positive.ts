import { NegativeNumberError } from "../../errors/internal/general.js";
import type { PositiveNumber, StrictPositiveNumber } from "../../types/numbers.js";

export function ensurePositive<T extends number>(n: T): PositiveNumber & T {
    if (n < 0) throw new NegativeNumberError();
    return n as PositiveNumber & T;
}

export function ensureStrictPositive<T extends number>(n: T): StrictPositiveNumber & T {
    if (n <= 0) throw new NegativeNumberError();
    return n as StrictPositiveNumber & T;
}
