import { EmbedBuilder, type MessageReplyOptions } from "discord.js";

import { EmbedColors } from "../../../assets/colors/colors";
import type { UserTable } from "../../../db/entities/User";
import { PermLevel } from "../../../db/entities/UserHost";
import { core } from "../../Core";
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
                    .setDescription("You do not have the permissions required to execute this action.")
                    .setFooter({
                        //prettier-ignore
                        text: `Required: \`${PermLevel[this.requiredLevel]}\` | Yours: \`${PermLevel[this.userLevel]}\``,
                    }),
            ],
        };
    }

    log(): void {
        core.logger.warn(
            `User ${this.user.name !== null ? this.user.name : "Unknown"} tried to run a ${
                PermLevel[this.requiredLevel]
            } action with ${PermLevel[this.userLevel]} perms.`,
        );
    }
}
