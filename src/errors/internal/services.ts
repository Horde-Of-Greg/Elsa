import { InternalError } from "./InternalError";

export class UserNotFoundError extends InternalError {
    readonly code = "SERVICES_USER_NOT_FOUND";

    constructor(userId: string) {
        super("Could not find user in the DB. This should have been caught earlier.", { userId });
    }
}
