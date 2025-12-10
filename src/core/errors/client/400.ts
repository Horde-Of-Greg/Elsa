import { AppError } from '../AppError';
import { EmbedBuilder, MessageReplyOptions } from 'discord.js';

export class MissingArgumentError extends AppError {
    readonly code = 'MISSING_ARGUMENT';
    readonly httpStatus = 400;

    constructor(message: string) {
        super(message);
    }

    get reply(): MessageReplyOptions {
        return {
            embeds: [
                new EmbedBuilder()
                    .setTitle('Missing arguments')
                    .setColor(0x00ffee)
                    .setDescription(this.message),
            ],
        };
    }

    log(): void {}
}
