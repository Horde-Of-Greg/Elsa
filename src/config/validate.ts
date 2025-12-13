import {
    type AppConfig,
    appConfigSchema,
    type Env,
    EnvSchema,
    SeederappConfigSchema,
    type SeederConfig,
} from './schema';
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
        const errors = parsed.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join('; ');
        throw new Error(`appConfig validation failed: ${errors}`);
    }
    return parsed.data;
}

export function validateSeederConfigs(json: object): SeederConfig {
    const parsed = SeederappConfigSchema.safeParse(json);
    if (!parsed.success) {
        const errors = parsed.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join('; ');
        throw new Error(`appConfig validation failed: ${errors}`);
    }
    return parsed.data;
}
