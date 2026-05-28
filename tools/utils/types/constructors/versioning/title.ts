import type { AcceptedTitleScope, AcceptedTitleType } from "../../../../types/versioning/title.js";

export function makeAcceptedTitleType(titleType: string): AcceptedTitleType {
    return titleType as AcceptedTitleType;
}

export function makeAcceptedTitleScope(titleScope: string): AcceptedTitleScope {
    return titleScope as AcceptedTitleScope;
}
