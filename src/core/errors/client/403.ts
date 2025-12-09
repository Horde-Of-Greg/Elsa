import { MessageReplyOptions, EmbedBuilder } from 'discord.js';
import { PermLevel } from '../../../db/entities/UserHost';
import { AppError } from '../AppError';
import { app } from '../../App';
import { UserTable } from '../../../db/entities/User';

export class PermissionDeniedError extends AppError {
    readonly code = 'PERMISSION_DENIED';
    readonly httpStatus = 403;

    constructor(
        readonly requiredLevel: PermLevel,
        readonly userLevel: PermLevel | null,
        readonly user: UserTable,
    ) {
        super(
            `Insufficient permission. [required: ${PermLevel[requiredLevel]} | yours: ${userLevel}]`,
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
                    Required: \`${this.requiredLevel}\`
                    Yours: \`${this.userLevel}\``),
            ],
        };
    }

    log(): void {
        app.core.logger.simpleLog(
            'warn',
            `User ${this.user.name} tried to run a ${this.requiredLevel} action with ${this.userLevel} perms.`,
        );
    }
}
