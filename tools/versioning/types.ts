const acceptedTypes = ["BREAK", "FEAT", "FIX", "DOCS", "STYLE", "REFACTOR", "TEST", "CI"] as const;
export type AcceptedType = (typeof acceptedTypes)[number];

const acceptedBumps = ["major", "minor", "patch"] as const;
export type AcceptedBump = (typeof acceptedBumps)[number];

const typePattern = `^\\[(${acceptedTypes.join("|")})\\] ((?:[^a-z\\b][^A-Z\\b]*\\s?)+)$`;
export const typesRegex = new RegExp(typePattern);
