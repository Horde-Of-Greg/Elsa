import z from "zod";

export type EmojiConfig = z.infer<typeof EmojiConfigSchema>;

export const EmojiConfigSchema = z.object({
    CHECKMARK: z.string().default(":white_check_mark:"),
    X_MARK: z.string().default(":x:"),
    QUESTION_MARK: z.string().default(":question:"),
    EXCLAMATION_MARK: z.string().default(":exclamation:"),
    WORRIED: z.string().default(":sweat:"),
    PING_PONG: z.string().default(":ping_pong:"),
});
