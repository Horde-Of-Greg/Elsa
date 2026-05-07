import { dependencies } from "../../core/Dependencies";
import { InternalError } from "../InternalError";

export class WrongEntryPointError extends InternalError {
    code = "WRONG_ENTRY_POINT_ERROR";

    constructor(correctEntryPoint: string, thisEntryPoint: string, details?: string) {
        super(
            `Wrong entry point into ${dependencies.config.app.NAME} used. Expected: ${correctEntryPoint}, Used: ${thisEntryPoint}.` +
                details,
        );
    }
}
