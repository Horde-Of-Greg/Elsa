import { EmbedBuilder, type MessageReplyOptions } from "discord.js";

import { EmbedColors } from "../../assets/colors/colors";
import { AppError } from "../AppError";

export class TagNotFoundError extends AppError {
    readonly code = "TAG_NOT_FOUND";
    readonly httpStatus = 404;

    constructor(public readonly tagName: string) {
        super(`Tag "${tagName}" not found`, { tagName });
    }

    get reply(): MessageReplyOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle("Could not Find Tag")
                    .setColor(EmbedColors.MAGENTA)
                    .setDescription(`Could not find tag \`${this.tagName}\` by name or alias.`),
            ],
        };
    }

    log(): void {}
}
