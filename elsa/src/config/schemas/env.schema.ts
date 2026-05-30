import z from "zod";

import { isDiscordToken } from "../helpers/discord";

export type Env = z.infer<typeof EnvSchema>;

const DEFAULT_PORT = {
    POSTGRES: 5432,
    REDIS: 6379,
};

// eslint-disable-next-line no-restricted-syntax
export const EnvSchema = z.object({
    DISCORD_TOKEN: z.string().refine(isDiscordToken, "Invalid DISCORD_TOKEN"),
    POSTGRES_HOST: z.string().default("localhost"),
    POSTGRES_PORT: z.coerce.number().int().positive().default(DEFAULT_PORT.POSTGRES),
    POSTGRES_DB: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    REDIS_USERNAME: z.string().default("default"),
    REDIS_PASSWORD: z.string(),
    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().int().positive().default(DEFAULT_PORT.REDIS),
});
