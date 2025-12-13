import z from "zod";

import { isDiscordToken } from "./tests";

export const EnvSchema = z.object({
    ENVIRONMENT: z.enum(["development", "test", "production"]).default("development"),
    DISCORD_TOKEN: z.string().refine(isDiscordToken, "Invalid DISCORD_TOKEN"),
    POSTGRES_HOST: z.string(),
    POSTGRES_PORT: z.coerce.number().int().positive().default(5432),
    POSTGRES_DB: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
});

export const appConfigSchema = z.object({
    PREFIX: z.string().min(1).max(3).default('!'),
    NAME: z.string().min(1),
    // TODO: make use of the appConfigs to actually define Commands
    LOGS: z.object({
        VERBOSE_LOGGING: z.boolean(),
        OUTPUT_PATH: z.string().regex(/^\/?(?:[a-z0-9]{0,256}\/)+$/i),
        // This check is just to allow absolute paths, but have the user understand it IS an absolute path.
        ALLOW_ABSOLUTE_PATH: z.boolean(),
    }),
});

export const SeederappConfigSchema = z.object({
    DEPTH: z.number().int().min(1).max(100000),
    DROP_DB: z.boolean(),
    SUDOERS: z.object({
        DO_SUDOERS: z.boolean(),
        USERS: z.array(z.string()),
        GUILDS: z.array(z.string()),
    }),
});

export type Env = z.infer<typeof EnvSchema>;
export type AppConfig = z.infer<typeof appConfigSchema>;
export type SeederConfig = z.infer<typeof SeederappConfigSchema>;
