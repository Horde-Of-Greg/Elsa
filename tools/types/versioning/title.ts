import type { acceptedBumps, acceptedTitleScopes, acceptedTitleTypes } from "../../versioning/constants.js";

export type AcceptedTitleType = (typeof acceptedTitleTypes)[number];
export type AcceptedBump = (typeof acceptedBumps)[number];
export type AcceptedTitleScope = (typeof acceptedTitleScopes)[number];

export type TitleParam = { bump: AcceptedBump | null; scopes: AcceptedTitleScope | "any" };

export type ParsedTitle = {
    type: AcceptedTitleType;
    scope?: AcceptedTitleScope;
    message: string;
};
