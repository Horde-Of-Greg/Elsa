import { PermLevel } from '../../../db/entities/UserHost';
import { AppError } from '../AppError';

export class PermissionDeniedError extends AppError {
    readonly code = 'PERMISSION_DENIED';
    readonly httpStatus = 403;

    constructor(readonly requiredLevel: PermLevel, readonly userLevel: PermLevel | null) {
        super(
            `Insufficient permission. [required: ${PermLevel[requiredLevel]} | yours: ${userLevel}]`,
            {
                requiredLevel,
                userLevel,
            },
        );
    }
}
