import { EmbedBuilder, type MessageReplyOptions, type User } from "discord.js";

import { EmbedColors } from "../../assets/colors/colors";
import { core } from "../../core/Core";
import { type CommandParams } from "../../types/command";
import { AppError } from "../AppError";

export class CooldownError extends AppError {
    readonly code = "TAG_EXISTS";
    readonly httpStatus = 409;

    constructor(
        readonly tryAgainIn_s: number,
        readonly user: User,
        readonly commandParams: CommandParams,
    ) {
        super(`User ${user.username} made too many requests on command ${commandParams.name}`, {
            user,
        });
    }

    get reply(): MessageReplyOptions {
        let tryAgainIn: number = this.tryAgainIn_s;
        let unit: "s" | "m" | "h" = "s";
        if (this.tryAgainIn_s > 60) {
            tryAgainIn = this.tryAgainIn_s / 60;
            unit = "m";
        }
        if (this.tryAgainIn_s > 3600) {
            tryAgainIn = this.tryAgainIn_s / 3600;
            unit = "h";
        }

        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle("Too Many Commands")
                    .setColor(EmbedColors.MAGENTA)
                    .setDescription(
                        `You hit the cooldown for ${
                            this.commandParams.name
                        }. Try again in ${tryAgainIn.toFixed(2)}${unit}`,
                    ),
            ],
        };
    }

    log(): void {
        core.logger.warn(this.message);
    }
}
