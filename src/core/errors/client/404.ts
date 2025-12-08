import { AppError } from '../AppError';

export class TagNotFoundError extends AppError {
    readonly code = 'TAG_NOT_FOUND';
    readonly httpStatus = 404;

    constructor(public readonly tagName: string) {
        super(`Tag "${tagName}" not found`, { tagName });
    }
}
