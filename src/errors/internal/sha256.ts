import { InternalError } from "../InternalError";

export class MalformedSHA256Error extends InternalError {
    readonly code = "MALFORMED_SHA_256_ERROR";

    constructor(format: string, restriction: string, failedRestrictionData: string) {
        super(`Invalid SHA-256 ${format}: expected ${restriction}, got ${failedRestrictionData}`);
    }
}
