import type { ConfigsResolver } from "../../types/config/config";
import { InternalError } from "../InternalError";

export class WrongEntryPointError extends InternalError {
    code = "WRONG_ENTRY_POINT";

    constructor(
        correctEntryPoint: string,
        thisEntryPoint: string,
        details?: string,
        configs?: ConfigsResolver,
    ) {
        super(
            `Wrong entry point into ${configs ? configs.app.NAME : "app"} used. Expected: ${correctEntryPoint}, Used: ${thisEntryPoint}.` +
                details,
        );
    }
}
