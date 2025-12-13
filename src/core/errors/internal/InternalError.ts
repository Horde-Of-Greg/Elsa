import { EmbedBuilder } from "@discordjs/builders";
import type { MessageReplyOptions } from "discord.js";

import { app } from "../../App";
import { AppError } from "../AppError";

export abstract class InternalError extends AppError {
    readonly httpStatus: 500;
    abstract readonly code: string;

    get reply(): MessageReplyOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle("Internal Error Occurred")
                    .setDescription("This is not your fault. It is ours. Oopsies.")
                    .setColor(0xff0000) // Red
                    .addFields(
                        {
                            name: "Code",
                            value: this.code,
                            inline: true,
                        },
                        {
                            name: "Message",
                            value: this.message,
                            inline: false,
                        },
                        {
                            name: "Trace",
                            value: `\`\`\`${this.truncatedStack}\`\`\``,
                            inline: false,
                        },
                    ),
            ],
        };
    }

    get truncatedStack() {
        const stack = this.stack ?? "No stack trace available";
        const stackLines = stack.match(/^\s+at\s+(.+?)\s+\(/gm);
        const methodNames = stackLines
            ? stackLines.map((line) => line.match(/at\s+(.+?)\s+\(/)?.[1] ?? line)
            : [stack];
        return methodNames.join("\n").slice(0, 1000);
    }

    log(): void {
        app.core.logger.simpleLog("error", this.message);
    }
}

export class UnknownInternalError extends InternalError {
    readonly code: "UNKNOWN_ERROR";

    constructor(message: string, stack?: string) {
        super(message, undefined, stack);
    }
}
