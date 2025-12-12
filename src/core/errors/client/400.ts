import { EmbedColors } from '../../../assets/colors/colors';
import { AppError } from '../AppError';
import { EmbedBuilder, type MessageReplyOptions } from 'discord.js';

export class MissingArgumentError extends AppError {
    readonly code = 'MISSING_ARGUMENT';
    readonly httpStatus = 400;

    get reply(): MessageReplyOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle('Missing arguments')
                    .setColor(EmbedColors.YELLOW)
                    .setDescription(this.message),
            ],
        };
    }

    log(): void {}
}
