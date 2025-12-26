import z from "zod";

import { isDiscordToken } from "./tests";

export const EnvSchema = z
    .object({
        DISCORD_TOKEN: z.string().refine(isDiscordToken, "Invalid DISCORD_TOKEN"),
        POSTGRES_HOST: z.string().default("localhost"),
        POSTGRES_PORT: z.coerce.number().int().positive().default(5432),
        POSTGRES_DB: z.string().optional(),
        POSTGRES_USER: z.string().optional(),
        POSTGRES_PASSWORD: z.string().optional(),
        REDIS_USERNAME: z.string().default("default"),
        REDIS_PASSWORD: z.string().optional(),
        REDIS_HOST: z.string().default("localhost"),
        REDIS_PORT: z.coerce.number().int().positive().default(6379),
    })
    .refine(
        (data) => {
            if (process.env.NODE_ENV !== "actions") {
                return Boolean(
                    data.POSTGRES_DB !== undefined &&
                    data.POSTGRES_USER !== undefined &&
                    data.POSTGRES_PASSWORD !== undefined,
                );
            }
            return true;
        },
        {
            message: "Postgres credentials required for non-actions environments",
            path: ["POSTGRES_PASSWORD"],
        },
    )
    .refine(
        (data) => {
            if (process.env.NODE_ENV !== "actions") {
                return Boolean(data.REDIS_PASSWORD !== undefined);
            }
            return true;
        },
        {
            message: "Redis credentials required for non-actions environments",
            path: ["REDIS_PASSWORD"],
        },
    );

export const appConfigSchema = z
    .object({
        PREFIX: z.string().min(1).max(3).default("!"),
        NAME: z.string().min(1),
        LOGS: z.object({
            VERBOSE_LOGGING: z.boolean(),
            OUTPUT_PATH: z.string().regex(/^\/?(?:[a-z0-9]{0,256}\/)+$/i),
            ALLOW_ABSOLUTE_PATH: z.boolean(),
        }),
    })
    .refine(
        (data) => {
            if (!data.LOGS.ALLOW_ABSOLUTE_PATH) {
                return !data.LOGS.OUTPUT_PATH.startsWith("/");
            }
            return true;
        },
        {
            message: "Need to explicitely allow absolute paths in app configs.",
            path: ["LOGS.OUTPUT_PATH"],
        },
    );

export const SeederappConfigSchema = z.object({
    DEPTH: z.number().int().min(1).max(100000),
    DROP_DB: z.boolean(),
    WAIT_TO_DROP_DB: z.boolean().default(true),
    SUDOERS: z.object({
        DO_SUDOERS: z.boolean(),
        USERS: z.array(z.string()),
        GUILDS: z.array(z.string()),
    }),
});

export type Env = z.infer<typeof EnvSchema>;
export type AppConfig = z.infer<typeof appConfigSchema>;
export type SeederConfig = z.infer<typeof SeederappConfigSchema>;
