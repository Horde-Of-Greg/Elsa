import { StandardError } from '../../core/errors/StandardError';
import { CategoryTable } from '../entities/Category';
import { CategoryTagTable } from '../entities/CategoryTag';
import { HostTable } from '../entities/Host';
import { TagTable } from '../entities/Tag';
import { TagHostTable } from '../entities/TagHost';
import { UserTable } from '../entities/User';
import { UserHostTable } from '../entities/UserHost';
import { ValidEntity } from '../types/entities';

const joinMap = new Map<string, new () => ValidEntity>([
    [makeKey(UserTable, HostTable), UserHostTable],
    [makeKey(TagTable, HostTable), TagHostTable],
    [makeKey(CategoryTable, TagTable), CategoryTagTable],
]);

const reverseMap = new Map<string, [new () => ValidEntity, new () => ValidEntity]>([
    ['UserHostTable', [UserTable, HostTable]],
    ['TagHostTable', [TagTable, HostTable]],
    ['CategoryTagTable', [CategoryTable, TagTable]],
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
): (new () => ValidEntity) | StandardError {
    const key = makeKey(a, b);
    const result = joinMap.get(key);
    if (!result) {
        return {
            type: 'error',
            code: 500,
            message: 'Failed while trying to find a Join Table',
            location: null,
            time: new Date(),
        };
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
): [new () => ValidEntity, new () => ValidEntity] | StandardError {
    const result = reverseMap.get(joinTable.name);
    if (!result) {
        return {
            type: 'error',
            code: 500,
            message: 'Failed while trying to find connected tables for join table',
            location: null,
            time: new Date(),
        };
    }
    return result;
}

function isValidJoin(
    joinTable: new () => ValidEntity,
    thisTable: new () => ValidEntity,
    thatTable: new () => ValidEntity,
): boolean {
    const key = makeKey(thisTable, thatTable);
    const lookup = joinMap.get(key);
    if (!lookup) return false;
    return lookup === joinTable;
}

export function makeKey(a: Function, b: Function): string {
    return [a.name, b.name].sort().join('-');
}
