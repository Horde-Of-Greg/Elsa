import {
    type AppConfig,
    appConfigSchema,
    type EmojiConfig,
    EmojiConfigSchema,
    type Env,
    EnvSchema,
    type SeederConfig,
    SeederConfigSchema,
} from "./schema.js";

//TODO: This is awful
export function validateEnvs(): Env {
    const parsed = EnvSchema.safeParse(process.env);
    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
        throw new Error(`Env validation failed: ${errors}`);
    }
    return parsed.data;
}

export function validateAppConfigs(json: object): AppConfig {
    const parsed = appConfigSchema.safeParse(json);
    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
        throw new Error(`appConfig validation failed: ${errors}`);
    }
    return parsed.data;
}

export function validateSeederConfigs(json: object): SeederConfig {
    const parsed = SeederConfigSchema.safeParse(json);
    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
        throw new Error(`appConfig validation failed: ${errors}`);
    }
    return parsed.data;
}

export function validateEmojiConfigs(json: object): EmojiConfig {
    const parsed = EmojiConfigSchema.safeParse(json);
    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
        throw new Error(`emojiConfig validation failed: ${errors}`);
    }
    return parsed.data;
}
