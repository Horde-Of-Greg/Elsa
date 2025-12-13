import { CategoryTable } from "../entities/Category";
import { CategoryTagTable } from "../entities/CategoryTag";
import { HostTable } from "../entities/Host";
import { TagTable } from "../entities/Tag";
import { TagAliasTable } from "../entities/TagAlias";
import { TagHostTable } from "../entities/TagHost";
import { UserTable } from "../entities/User";
import { UserHostTable } from "../entities/UserHost";
import type { ValidEntity } from "../types/entities";
import { HostAliasTable } from "../entities/HostAlias";
import { JoinTableError } from "../../core/errors/internal/db";

const joinMap = new Map<string, new () => ValidEntity>([
    [makeKey(UserTable, HostTable), UserHostTable],
    [makeKey(TagTable, HostTable), TagHostTable],
    [makeKey(CategoryTable, TagTable), CategoryTagTable],
    [makeKey(TagAliasTable, HostTable), HostAliasTable],
]);

const reverseMap = new Map<string, [new () => ValidEntity, new () => ValidEntity]>([
    ["UserHostTable", [UserTable, HostTable]],
    ["TagHostTable", [TagTable, HostTable]],
    ["CategoryTagTable", [CategoryTable, TagTable]],
    ["HostAliasTable", [HostTable, TagAliasTable]],
]);

/**
 * Find a join table given the two base tables. A join table allows for many -> many relations.
 * These are defined statically. This utility classes is simply there to make sure you get the right join table.
 *
 * @param a The first table you want to find the join table for.
 * @param b The second table you want to find the join table for.
 * @returns The join table constructor, or an error if you tried to find a join table that does not exist.
 */
export function getJoinTable(
    a: new () => ValidEntity,
    b: new () => ValidEntity,
): (new () => ValidEntity) | JoinTableError {
    const key = makeKey(a, b);
    const result = joinMap.get(key);

    if (!result) {
        throw new JoinTableError("Failed to get Join Table", [a, b]);
    }

    return result;
}

/**
 * Get the two entity tables that a junction table connects.
 *
 * @param joinTable The junction table class
 * @returns Array of the two entity classes, or an error if not found
 */
export function getConnectedTables(
    joinTable: new () => ValidEntity,
): Array<new () => ValidEntity> | JoinTableError {
    const result = reverseMap.get(joinTable.name);

    if (!result) {
        throw new JoinTableError("Failed to get Join Table for connected", [joinTable]);
    }

    return result;
}

export function makeKey(a: new () => ValidEntity, b: new () => ValidEntity): string {
    return [a.name, b.name].sort().join("-");
}
