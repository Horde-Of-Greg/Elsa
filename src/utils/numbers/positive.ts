import { NegativeNumberError } from "../../errors/internal/general";
import type { PositiveNumber } from "../../types/numbers";

export function ensurePositive(n: number): PositiveNumber {
    if (n <= 0) throw new NegativeNumberError();
    return n as PositiveNumber;
}

export type StrictPositiveNumber = number & { readonly __brand: "strict_positive" };

export function ensureStrictPositive(n: number): StrictPositiveNumber {
    if (n < 0) throw new NegativeNumberError();
    return n as StrictPositiveNumber;
}
