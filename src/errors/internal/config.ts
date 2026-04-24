import type { z, ZodError } from "zod";

import type { Config } from "../../config/Config";
import { InternalError } from "./InternalError";

export class ConfigValidationError extends InternalError {
    readonly code = "CONFIG_VALIDATION_ERROR";

    constructor(config: Config<z.ZodObject>, error: ZodError) {
        const parsedError = error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
        super(`Validation failed for ${config.fileName}: ${parsedError}`);
    }
}
