import { AppError } from '../AppError';

export class UserNotFoundError extends AppError {
    readonly httpStatus = 500;
    readonly code = 'SERVICES_USER_NOT_FOUND';

    constructor(userId: string) {
        super('Could not find user in the DB. This should have been caught earlier.', { userId });
    }
}
