import { PermLevel } from '../../../db/entities/UserHost';
import { AppError } from '../AppError';

export class PermissionDeniedError extends AppError {
    readonly code = 'PERMISSION_DENIED';
    readonly httpStatus = 403;

    constructor(public readonly requiredLevel: PermLevel) {
        super(`Insufficient permissions (required: ${PermLevel[requiredLevel]})`, {
            requiredLevel,
        });
    }
}
