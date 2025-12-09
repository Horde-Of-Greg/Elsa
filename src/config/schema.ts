import z from 'zod';
import { isDiscordToken } from './tests';

export const EnvSchema = z.object({
    ENVIRONMENT: z.enum(['development', 'test', 'production']).default('development'),
    DISCORD_TOKEN: z.string().refine(isDiscordToken, 'Invalid DISCORD_TOKEN'),
    POSTGRES_HOST: z.string(),
    POSTGRES_PORT: z.coerce.number().int().positive().default(5432),
    POSTGRES_DB: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
});

export const ConfigSchema = z.object({
    PREFIX: z.string().min(1).max(3).default('!'),
    NAME: z.string().min(1),
    // TODO: make use of the Configs to actually define Commands
    VERBOSE_LOGGING: z.boolean(),
});

export const SeederConfigSchema = z.object({
    DEPTH: z.number().int().min(1).max(100000),
});

export type Env = z.infer<typeof EnvSchema>;
export type Config = z.infer<typeof ConfigSchema>;
export type SeederConfig = z.infer<typeof SeederConfigSchema>;
