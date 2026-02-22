import { EmbedBuilder } from "@discordjs/builders";
import type { MessageReplyOptions } from "discord.js";

import { EmbedColors } from "../../assets/colors/colors";
import { emojis } from "../../config/config";
import { core } from "../../core/Core";
import { AppError } from "../AppError";

export abstract class InternalError extends AppError {
    readonly httpStatus = 500;
    abstract readonly code: string;

    get reply(): MessageReplyOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle("Internal Error Occurred")
                    .setDescription(`This is not your fault. It is ours. ${emojis.WORRIED}`)
                    .setColor(EmbedColors.RED)
                    .addFields(
                        {
                            name: "Code",
                            value: this.code ?? "UNKNOWN",
                            inline: true,
                        },
                        {
                            name: "Message",
                            value: this.message || "No message provided",
                            inline: false,
                        },
                        {
                            name: "Trace",
                            value: `\`\`\`${this.truncatedStack || "No stack"}\`\`\``,
                            inline: false,
                        },
                    ),
            ],
        };
    }

    get truncatedStack() {
        const MAX_STACKTRACE_LENGTH = 1000;

        const stack = this.stack ?? "No stack trace available";
        const stackLines = stack.match(/^\s+at\s+(.+?)\s+\(/gm);
        const methodNames = stackLines
            ? stackLines.map((line) => line.match(/at\s+(.+?)\s+\(/)?.[1] ?? line)
            : [stack];
        return methodNames.join("\n").slice(0, MAX_STACKTRACE_LENGTH);
    }

    log(): void {
        core.logger.error(this.message);
    }
}

export class UnknownInternalError extends InternalError {
    readonly code = "UNKNOWN_ERROR";

    constructor(message: string, stack?: string) {
        super(message, undefined, stack);
    }
}
