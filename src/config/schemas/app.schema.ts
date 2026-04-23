import z from "zod";

import { ensureStrictPositive } from "../../utils/numbers/positive";

export type AppConfig = z.infer<typeof AppConfigSchema>;

export const AppConfigSchema = z
    .object({
        PREFIX: z.string().min(1).max(3).default("!"),
        NAME: z.string().min(1),
        LOGS: z.object({
            VERBOSE_LOGGING: z.boolean(),
            OUTPUT_PATH: z.string().regex(/^\/?(?:[a-z0-9]{0,256}\/)+$/i),
            ALLOW_ABSOLUTE_PATH: z.boolean(),
        }),
        COMMANDS: z.object({
            UNDELETE: z.object({
                DELAY_S: z.number().int().min(1).transform(ensureStrictPositive),
            }),
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
            message: "Need to explicitly allow absolute paths in app configs.",
            path: ["LOGS.OUTPUT_PATH"],
        },
    );
