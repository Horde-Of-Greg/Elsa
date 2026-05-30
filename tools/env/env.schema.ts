import z from "zod";

import { NodeEnvironment } from "../types/node/env.js";
import { makeGithubToken } from "../utils/types/constructors/github/token.js";

export type Env = z.infer<typeof EnvSchema>;

const DEFAULT_PORT = {
    POSTGRES: 5432,
    REDIS: 6379,
};

export const EnvSchema = z.object({
    POSTGRES_HOST: z.string().default("localhost"),
    POSTGRES_PORT: z.coerce.number().int().positive().default(DEFAULT_PORT.POSTGRES),
    POSTGRES_DB: z.string().optional(),
    POSTGRES_USER: z.string().optional(),
    POSTGRES_PASSWORD: z.string().optional(),

    REDIS_USERNAME: z.string().default("default"),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().int().positive().default(DEFAULT_PORT.REDIS),

    NODE_ENV: z.enum(NodeEnvironment).optional(),

    GITHUB_TOKEN: z
        .string()
        .min(20)
        .max(1000)
        .regex(/^(gh[psuor]_|github_pat_|v\d+\.)[A-Za-z0-9_./=-]+$/, "Expected a GitHub token-like value")
        .transform(makeGithubToken)
        .optional(),
    GITHUB_OUTPUT: z.string().optional(),
});
