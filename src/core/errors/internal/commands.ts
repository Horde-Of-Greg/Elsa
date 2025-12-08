import { Message } from 'discord.js';
import { AppError } from '../AppError';

export class NoContextError extends AppError {
    readonly code: 'COMMAND_NO_CONTEXT';
    readonly httpStatus: 500;

    constructor() {
        super('Failed to receive a context');
    }
}

export class NoGuildError extends AppError {
    readonly code = 'COMMAND_NO_GUILD';
    readonly httpStatus = 501;

    constructor() {
        super('We do not support commands in DMs. YET. Feature may come later.');
    }
}

export class NoParsingError extends AppError {
    readonly code = 'COMMAND_NO_PARSING';
    readonly httpStatus: 500;

    constructor(message: Message) {
        super('Command was not parsed at all.', { message });
    }
}
