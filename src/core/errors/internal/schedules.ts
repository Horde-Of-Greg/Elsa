import { InternalError } from "./InternalError";

export class ReaddirError extends InternalError {
    readonly code = "READDIR";

    constructor(error: Error) {
        super(error.message, { error });
    }
}
