import { EmbedBuilder, type MessageReplyOptions } from "discord.js";

import { EmbedColors } from "../../assets/colors/colors";
import { emojis } from "../../config/config";
import { core } from "../../core/Core";
import type { TagTable } from "../../db/entities/Tag";
import type { UserTable } from "../../db/entities/User";
import { PermLevel } from "../../db/entities/UserHost";
import { AppError } from "../AppError";

export class PermissionDeniedError extends AppError {
    readonly code = "PERMISSION_DENIED";
    readonly httpStatus = 403;

    constructor(
        readonly requiredLevel: PermLevel,
        readonly userLevel: PermLevel,
        readonly user: UserTable,
    ) {
        super(
            `Insufficient permission. [required: ${PermLevel[requiredLevel]} | user's: ${PermLevel[userLevel]}]`,
            {
                requiredLevel,
                userLevel,
            },
        );
    }

    get reply(): MessageReplyOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle("Insufficient permissions")
                    .setColor(EmbedColors.RED)
                    .setDescription(
                        `You do not have the permissions required to execute this action. ${emojis.X_MARK}`,
                    )
                    .setFooter({
                        text: `Required: \`${PermLevel[this.requiredLevel]}\` | Yours: \`${PermLevel[this.userLevel]}\``,
                    }),
            ],
        };
    }

    log(): void {
        core.logger.warn(
            `User ${getUserName(this.user)} tried to run a ${
                PermLevel[this.requiredLevel]
            } action with ${PermLevel[this.userLevel]} perms.`,
        );
    }
}

export class NotOwnerError extends AppError {
    readonly code = "NOT_OWNER";
    readonly httpStatus = 403;

    constructor(
        readonly owner: UserTable,
        readonly user: UserTable,
        readonly tag: TagTable,
    ) {
        super(`You do not own this tag. This tag belongs to ${owner.discordId}`, {
            owner,
            user,
            tag,
        });
    }

    get reply(): MessageReplyOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle("Not Owner")
                    .setColor(EmbedColors.RED)
                    .setDescription(
                        `You do not own this tag ${emojis.EXCLAMATION_MARK}. You can only edit the tags you own.\ntag owner: <@${this.owner.discordId}>`,
                    ),
            ],
        };
    }

    log(): void {
        core.logger.warn(
            `User ${getUserName(this.user)} tried to edit tag ${this.tag.name}, but it did not belong to them.`,
        );
        core.logger.debug("owner id:", this.owner.id);
        core.logger.debug("user id:", this.user.id);
    }
}

function getUserName(user: UserTable): string {
    return user.name ?? "Unknown";
}
