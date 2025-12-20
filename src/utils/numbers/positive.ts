import { NegativeNumberError } from "../../errors/internal/general";

export type PositiveNumber = number & { readonly __brand: "positive" };

export function ensurePositive(n: number): PositiveNumber {
    if (n <= 0) throw new NegativeNumberError();
    return n as PositiveNumber;
}
