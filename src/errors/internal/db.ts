import type { ValidEntity } from "../../types/db/entities.js";
import { InternalError } from "./InternalError.js";

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
