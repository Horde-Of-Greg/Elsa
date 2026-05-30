import type { MalformedDataInfo } from "../../types/errors/data";
import { InternalError } from "../InternalError";

export class NegativeNumberError extends InternalError {
    readonly code = "NEGATIVE_NUMBER";

    constructor() {
        super("Tried to assign a negative number where a positively branded number was required.");
    }
}

export class MalformedParsingResultError extends InternalError {
    readonly code = "MALFORMED_PARSING_RESULT";

    constructor(data: MalformedDataInfo) {
        super(
            `Could not parse ${data.objectTested} from ${data.source} properly; ${data.failedCondition}.`,
            data,
        );
    }
}
