import { EmbedBuilder, type MessageReplyOptions } from 'discord.js';
import { PermLevel } from '../../../db/entities/UserHost';
import { AppError } from '../AppError';
import { app } from '../../App';
import type { UserTable } from '../../../db/entities/User';

export class PermissionDeniedError extends AppError {
    readonly code = 'PERMISSION_DENIED';
    readonly httpStatus = 403;

    constructor(
        readonly requiredLevel: PermLevel,
        readonly userLevel: PermLevel,
        readonly user: UserTable,
    ) {
        super(
            `Insufficient permission. [required: ${PermLevel[requiredLevel]} | yours: ${PermLevel[userLevel]}]`,
            {
                requiredLevel,
                userLevel,
            },
        );
    }

    get reply(): MessageReplyOptions {
        return {
            embeds: [
                new EmbedBuilder().setTitle('Insufficient permissions').setColor(0xff0000)
                    .setDescription(`You do not have the permissions required to execute this action.
                    Required: \`${PermLevel[this.requiredLevel]}\`
                    Yours: \`${PermLevel[this.userLevel]}\``),
            ],
        };
    }

    log(): void {
        app.core.logger.simpleLog(
            'warn',
            `User ${this.user.name !== null ? this.user.name : 'Unknown'} tried to run a ${
                PermLevel[this.requiredLevel]
            } action with ${PermLevel[this.userLevel]} perms.`,
        );
    }
}
