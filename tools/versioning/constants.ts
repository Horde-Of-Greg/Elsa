import type { AcceptedTitleType, TitleParam } from "../types/versioning/title.js";

export const acceptedProjects = ["elsa", "tools"] as const;

export const acceptedTitleTypes = [
    "BREAK",
    "FEAT",
    "FIX",
    "DOCS",
    "STYLE",
    "REFACTOR",
    "TEST",
    "CI",
    "AUTO",
] as const;
export const acceptedBumps = ["major", "minor", "patch", "none"] as const;
export const acceptedTitleScopes = [...acceptedProjects, "all"] as const;

export const titleParams: Record<AcceptedTitleType, TitleParam> = {
    BREAK: {
        bump: "major",
        scopes: "elsa",
    },
    FEAT: {
        bump: "minor",
        scopes: "elsa",
    },
    FIX: {
        bump: "patch",
        scopes: "any",
    },
    DOCS: {
        bump: null,
        scopes: "any",
    },
    STYLE: {
        bump: null,
        scopes: "any",
    },
    REFACTOR: {
        bump: null,
        scopes: "any",
    },
    TEST: {
        bump: null,
        scopes: "elsa",
    },
    CI: {
        bump: "minor",
        scopes: "tools",
    },
    AUTO: {
        bump: null,
        scopes: "any",
    },
};
