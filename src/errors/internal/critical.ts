import { InternalError } from "../InternalError";

export class ErrorNotAnErrorError extends InternalError {
    readonly code = "CRITICAL_ERROR_NOT_AN_ERROR_ERROR";

    constructor(objectReceived: unknown) {
        super(
            "Uhm, how did we get here? Somehow, a process threw, but didn't throw an error. This should really never happen.",
            { objectReceived },
        );
    }
}
