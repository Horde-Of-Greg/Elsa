import { TagTable } from '../../../db/entities/Tag';
import { AppError } from '../AppError';

export class TagExistsError extends AppError {
    readonly code = 'TAG_EXISTS';
    readonly httpStatus = 409;

    constructor(readonly tagName: string) {
        super(`Tag "${tagName}" already exists`, { tagName });
    }
}

export class TagBodyExistsError extends AppError {
    readonly code = 'TAG_BODY_EXISTS';
    readonly httpStatus: 409;

    constructor(readonly tagBody: string, existingTag: TagTable) {
        super(
            `Tag \`${existingTag.name}\` already has the same body. We don't allow duplicate tags for now.`,
            { tagBody },
        );
    }
}
