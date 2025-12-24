import { EmbedBuilder } from "@discordjs/builders";
import type { MessageReplyOptions } from "discord.js";

import { EmbedColors } from "../../assets/colors/colors";
import type { TagTable } from "../../db/entities/Tag";
import { AppError } from "../AppError";

export class TagExistsError extends AppError {
    readonly code = "TAG_EXISTS";
    readonly httpStatus = 409;

    constructor(readonly tag: TagTable) {
        super(`Tag "${tag.name}" already exists`, { tag });
    }

    get reply(): MessageReplyOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle("Tag already exists")
                    .setColor(EmbedColors.YELLOW)
                    .setDescription(
                        `Cannot add tag ${this.tag.name} as it already exists, and is owned by <@${this.tag.author.discordId}>`,
                    ),
            ],
        };
    }

    log(): void {}
}

export class TagBodyExistsError extends AppError {
    readonly code = "TAG_BODY_EXISTS";
    readonly httpStatus: 409;

    constructor(
        readonly tagName: string,
        readonly tagBody: string,
        readonly existingTag: TagTable,
        readonly type: "edit"|"add"
    ) {
        super(
            type === "edit" ? `Tag ${existingTag.name} already contains this same body` : `Tag \`${existingTag.name}\` already has the same body. We don't allow duplicate tags for now.`,
            { tagBody },
        );
    }

    get reply(): MessageReplyOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle("Tag body duplicate")
                    .setColor(EmbedColors.YELLOW)
                    .setDescription(
                        this.type === "edit" ? `Cannot edit tag ${this.tagName} as it already contains the same body.` : `Cannot add tag ${this.tagName} as it contains the same body as tag: ${this.existingTag.name}. Please use !alias instead.`,
                    ),
            ],
        };
    }

    log(): void {}
}
