import type { AcceptedTitleScope, AcceptedTitleType } from "../../../../types/versioning/title.js";
import { acceptedTitleScopes, acceptedTitleTypes } from "../../../../versioning/constants.js";

export function makeAcceptedTitleType(titleType: string): AcceptedTitleType {
    if (!(acceptedTitleTypes as readonly string[]).includes(titleType)) {
        throw new Error(`Received Invalid Title Type: ${titleType}`);
    }
    return titleType as AcceptedTitleType;
}

export function makeAcceptedTitleScope(titleScope: string): AcceptedTitleScope {
    if (!(acceptedTitleScopes as readonly string[]).includes(titleScope)) {
        throw new Error(`Received Invalid Title Type: ${titleScope}`);
    }
    return titleScope as AcceptedTitleScope;
}
