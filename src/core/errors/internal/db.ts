import { ValidEntity } from '../../../db/types/entities';
import { AppError } from '../AppError';
import Message from 'discord.js';

export abstract class DatabaseError extends AppError {
    abstract readonly code: string;
    readonly httpStatus = 500;

    constructor(message: string, entities?: ValidEntity[], readonly extraMeta?: any) {
        super(message, { entities });
    }
}

export class JoinTableError extends DatabaseError {
    readonly code = 'DATABASE_JOIN';

    constructor(message: string, tables: Array<new () => ValidEntity>) {
        super(message, undefined, tables);
    }
}
