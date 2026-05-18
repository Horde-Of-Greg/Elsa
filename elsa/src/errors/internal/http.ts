import type { MalformedDataInfo } from "../../types/errors/data";
import { InternalError } from "../InternalError";

export class FailedToFetchError extends InternalError {
    readonly code = "HTTP_FAILED_TO_FETCH";

    constructor(response: Response, message?: string) {
        const intro = message !== undefined ? `${message}.` : "";
        super(`${intro}\nSTATUS: ${response.status}\nINFO: ${response.statusText}`);
    }
}

export class MalformedResponseError extends InternalError {
    readonly code = "HTTP_MALFORMED_RESPONSE";

    constructor(data: MalformedDataInfo) {
        super(
            `Could not fetch ${data.objectTested} from ${data.source} properly; ${data.failedCondition}.`,
            data,
        );
    }
}
