import { AppError } from '../AppError';
import Message from 'discord.js';

export class MissingArgumentError extends AppError {
    readonly code = 'MISSING_ARGUMENT';
    readonly httpStatus = 400;

    constructor(message: string) {
        super(message);
    }
}
