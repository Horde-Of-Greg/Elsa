import type { z, ZodError } from "zod";

import type { Config } from "../../config/Config";
import { InternalError } from "../InternalError";

export class ConfigValidationError extends InternalError {
    readonly code = "CONFIG_VALIDATION";

    constructor(config: Config<z.ZodObject>, error: ZodError) {
        const parsedError = error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
        super(`Validation failed for ${config.fileName}: ${parsedError}`);
    }
}

export class EnvVariableNotFound extends InternalError {
    readonly code = "ENV_VAR_NOT_FOUND";

    constructor(envVarName: string) {
        super(
            `Tried to access the .env variable ${envVarName}, but could not access it. If you are an user seeing this, contact whoever is running this bot. This should not happen.`,
        );
    }
}
