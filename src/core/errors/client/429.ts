import { type MessageReplyOptions, EmbedBuilder, type User } from 'discord.js';
import { AppError } from '../AppError';
import { type CommandParams } from '../../../commands/types';
import { app } from '../../App';
import { EmbedColors } from '../../../assets/colors';

export class CooldownError extends AppError {
    readonly code = 'TAG_EXISTS';
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
        let unit: 's' | 'm' | 'h' = 's';
        if (this.tryAgainIn_s > 60) {
            tryAgainIn = this.tryAgainIn_s / 60;
            unit = 'm';
        }
        if (this.tryAgainIn_s > 3600) {
            tryAgainIn = this.tryAgainIn_s / 3600;
            unit = 'h';
        }

        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle('Too Many Commands')
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
        app.core.logger.simpleLog('warn', this.message);
    }
}
