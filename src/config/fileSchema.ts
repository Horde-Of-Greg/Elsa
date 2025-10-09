import { z } from 'zod';
import { isDiscordToken } from './tests';

export const EnvFileSchema = z.object({
    ENVIRONMENT: z.enum(['development', 'test', 'production']).default('development'),
    DISCORD_TOKEN: z.string().refine(isDiscordToken, 'Invalid DISCORD_TOKEN'),
    POSTGRES_HOST: z.string(),
    POSTGRES_PORT: z.coerce.number().int().positive().default(5432),
    POSTGRES_DB: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
});

export const ConfigFileSchema = z.object({
    prefix: z.string().min(1).max(3).default('!'),
    name: z.string().min(1),
    cmdRanks: z.object({
        tag: z.number().int().max(4),
        addTag: z.number().int().max(4),
        setRank: z.number().int().max(4),
    }),
});

export const SeederConfigFileSchema = z.object({
    depth: z.number().int().min(1).max(100000),
});
