export function isActionsEnvironment(): boolean {
    return process.env.NODE_ENV === "actions";
}

export function isProductionEnvironment(): boolean {
    return process.env.NODE_ENV === "production";
}

export function isDevelopmentEnvironment(): boolean {
    return process.env.NODE_ENV === "development";
}

export function isTestsEnvironment(): boolean {
    return process.env.NODE_ENV === "test";
}
