import type { ValidEntity } from "../../types/db/entities";
import { InternalError } from "../InternalError";

abstract class DatabaseError extends InternalError {
    abstract readonly code: string;

    constructor(
        message: string,
        entities?: ValidEntity[],
        readonly extraMeta?: Record<string, unknown>,
    ) {
        super(message, { entities });
    }
}

export class JoinTableError extends DatabaseError {
    readonly code = "DATABASE_JOIN";

    constructor(message: string, tables: Array<new () => ValidEntity>) {
        super(message, undefined, { tables });
    }
}

export class RelationNotFoundError extends InternalError {
    readonly code = "RELATION_NOT_FOUND";

    constructor(joinTable: string, firstTable: string, secondTable?: string) {
        if (secondTable === undefined) {
            super(`Could not find relation in ${joinTable} for ${firstTable}`);
        } else {
            super(`Could not find relations in ${joinTable} for ${firstTable} and ${secondTable}`);
        }
    }
}
