import { EmbedBuilder, type MessageReplyOptions } from "discord.js";

import { EmbedColors } from "../../assets/colors/colors.js";
import { emojis } from "../../config/config.js";
import { AppError } from "../AppError.js";

export class MissingArgumentError extends AppError {
    readonly code = "MISSING_ARGUMENT";
    readonly httpStatus = 400;

    get reply(): MessageReplyOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle("Missing arguments")
                    .setColor(EmbedColors.YELLOW)
                    .setDescription(this.message + emojis.QUESTION_MARK),
            ],
        };
    }

    log(): void {}
}

export class BadArgumentError extends AppError {
    readonly code = "BAD_ARGUMENT";
    readonly httpStatus: 400;

    constructor(
        readonly argName: string,
        readonly expectedValues: string[],
        readonly value: string,
        readonly isCaseSensitive: boolean,
    ) {
        super(`Argument ${argName} expected to be <${expectedValues.join("|")}>. Got ${value} instead.>`, {
            value,
        });
    }

    get reply(): MessageReplyOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle("Malformed Argument")
                    .setDescription(
                        `The bot successfully received the argument for ${this.argName}, but deemed it invalid.`,
                    )
                    .setFields([
                        { name: "Expected values", value: this.expectedValues.join("|") },
                        { name: "Value received", value: this.value },
                    ])
                    .setFooter({ text: `Is case sensitive? ${this.isCaseSensitive ? "Yes" : "No"}` })
                    .setColor(EmbedColors.ORANGE),
            ],
        };
    }

    log(): void {}
}
