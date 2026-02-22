import { EmbedBuilder, type MessageReplyOptions } from "discord.js";

import { EmbedColors } from "../../assets/colors/colors.js";
import { emojis } from "../../config/config.js";
import { AppError } from "../AppError.js";

export class TagNotFoundError extends AppError {
    readonly code = "TAG_NOT_FOUND";
    readonly httpStatus = 404;

    constructor(
        public readonly tagName: string,
        readonly strict: boolean,
    ) {
        super(`Tag "${tagName}" not found`, { tagName });
    }

    get reply(): MessageReplyOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle("Could not Find Tag")
                    .setColor(EmbedColors.MAGENTA)
                    .setDescription(
                        `Could not find tag \`${this.tagName}\` by name${this.strict ? "" : " or alias"}. ${emojis.QUESTION_MARK}`,
                    ),
            ],
        };
    }

    log(): void {}
}

export class DiscordUserNotFound extends AppError {
    readonly code = "DC_USER_NOT_FOUND";
    readonly httpStatus: 404;

    constructor(readonly userSearchQuery: { type: "username" | "display name" | "user id"; value: string }) {
        super(
            `Could not find any user with ${userSearchQuery.type} equal to ${userSearchQuery.value} on discord's API.`,
        );
    }

    get reply(): MessageReplyOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle("Discord User Not Found")
                    .setDescription(
                        `Could not find user on discord's API. The user you are trying to find probably does not exist anymore, or you entered its data wrong.`,
                    )
                    .setFields([{ name: this.userSearchQuery.type, value: this.userSearchQuery.value }])
                    .setColor(EmbedColors.YELLOW),
            ],
        };
    }

    log(): void {}
}
