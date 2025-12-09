import { Config, ConfigSchema, Env, EnvSchema, SeederConfig, SeederConfigSchema } from './schema';
//TODO: This is awful
export function validateEnvs(): Env {
    const parsed = EnvSchema.safeParse(process.env);
    if (!parsed.success) {
        const errors = parsed.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join('; ');
        throw new Error(`Env validation failed: ${errors}`);
    }
    return parsed.data;
}

export function validateConfigs(json: Object): Config {
    const parsed = ConfigSchema.safeParse(json);
    if (!parsed.success) {
        const errors = parsed.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join('; ');
        throw new Error(`Config validation failed: ${errors}`);
    }
    return parsed.data;
}

export function validateSeederConfigs(json: Object): SeederConfig {
    const parsed = SeederConfigSchema.safeParse(json);
    if (!parsed.success) {
        const errors = parsed.error.issues
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join('; ');
        throw new Error(`Config validation failed: ${errors}`);
    }
    return parsed.data;
}
