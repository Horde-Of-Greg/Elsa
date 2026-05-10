import { InternalError } from "../InternalError";

export class EnvVariableNotFound extends InternalError {
    readonly code = "ENV_VAR_NOT_FOUND";

    constructor(envVarName: string) {
        super(
            `Tried to access the .env variable ${envVarName}, but could not access it. If you are an user seeing this, contact whoever is running this bot. This should not happen.`,
        );
    }
}
