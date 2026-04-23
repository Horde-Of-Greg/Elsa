import z from "zod";

import { isActionsEnvironment } from "../../utils/node/environment";
import { isDiscordToken } from "../helpers/discord";

export type Env = z.infer<typeof EnvSchema>;

const DEFAULT_PORT = {
    POSTGRES: 5432,
    REDIS: 6379,
};

export const EnvSchema = z
    .object({
        DISCORD_TOKEN: z.string().refine(isDiscordToken, "Invalid DISCORD_TOKEN"),
        POSTGRES_HOST: z.string().default("localhost"),
        POSTGRES_PORT: z.coerce.number().int().positive().default(DEFAULT_PORT.POSTGRES),
        POSTGRES_DB: z.string().optional(),
        POSTGRES_USER: z.string().optional(),
        POSTGRES_PASSWORD: z.string().optional(),
        REDIS_USERNAME: z.string().default("default"),
        REDIS_PASSWORD: z.string().optional(),
        REDIS_HOST: z.string().default("localhost"),
        REDIS_PORT: z.coerce.number().int().positive().default(DEFAULT_PORT.REDIS),
    })
    .refine(
        (data) => {
            if (!isActionsEnvironment()) {
                return (
                    data.POSTGRES_DB !== undefined &&
                    data.POSTGRES_USER !== undefined &&
                    data.POSTGRES_PASSWORD !== undefined
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
            if (!isActionsEnvironment()) {
                return data.REDIS_PASSWORD !== undefined;
            }
            return true;
        },
        {
            message: "Redis credentials required for non-actions environments",
            path: ["REDIS_PASSWORD"],
        },
    );
