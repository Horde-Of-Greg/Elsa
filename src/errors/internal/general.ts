import { InternalError } from "./InternalError.js";

export class NegativeNumberError extends InternalError {
    readonly code = "NEGATIVE_NUMBER";

    constructor() {
        super("Tried to assign a negative number where a positively branded number was required.");
    }
}
