import z from "zod";

export type SeederConfig = z.infer<typeof SeederConfigSchema>;

export const SeederConfigSchema = z.object({
    DEPTH: z.number().int().min(1).max(100000),
    DROP_DB: z.boolean(),
    WAIT_TO_DROP_DB: z.boolean().default(true),
    SUDOERS: z.object({
        DO_SUDOERS: z.boolean(),
        USERS: z.array(z.string()),
        GUILDS: z.array(z.string()),
    }),
});
