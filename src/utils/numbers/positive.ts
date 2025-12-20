import { NegativeNumberError } from "../../errors/internal/general";
import type { PositiveNumber } from "../../types/numbers";

export function ensurePositive(n: number): PositiveNumber {
    if (n <= 0) throw new NegativeNumberError();
    return n as PositiveNumber;
}
