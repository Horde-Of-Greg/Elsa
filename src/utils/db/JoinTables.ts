import { CategoryTable } from '../../db/entities/Category';
import { CategoryTagTable } from '../../db/entities/CategoryTag';
import { HostTable } from '../../db/entities/Host';
import { TagTable } from '../../db/entities/Tag';
import { TagHostTable } from '../../db/entities/TagHost';
import { UserTable } from '../../db/entities/User';
import { UserHostTable } from '../../db/entities/UserHost';
import { ValidEntity } from '../../db/types/entities';
import { StandardError } from '../../types/error/StandardError';

export class JoinTables {
    /**
     * Find a join table given the two base tables. A join table allows for many -> many relations.
     * These are defined statically. This utility classes is simply there to make sure you get the right join table.
     *
     * @param a The first table you want to find the join table for.
     * @param b The second table you want to find the join table for.
     * @returns The join table constructor, or an error if you tried to find a join table that does not exist.
     */
    static getJoinTable(
        a: new () => ValidEntity,
        b: new () => ValidEntity,
    ): (new () => ValidEntity) | StandardError {
        const key = JoinTables.makeKey(a, b);
        const result = JoinTables.joinMap.get(key);
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
    static getConnectedTables(
        joinTable: new () => ValidEntity,
    ): [new () => ValidEntity, new () => ValidEntity] | StandardError {
        const result = JoinTables.reverseMap.get(joinTable.name);
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

    private static joinMap = new Map<string, new () => ValidEntity>([
        [JoinTables.makeKey(UserTable, HostTable), UserHostTable],
        [JoinTables.makeKey(TagTable, HostTable), TagHostTable],
        [JoinTables.makeKey(CategoryTable, TagTable), CategoryTagTable],
    ]);

    // Reverse map: JunctionTable -> [EntityA, EntityB]
    private static reverseMap = new Map<
        string,
        [new () => ValidEntity, new () => ValidEntity]
    >([
        ['UserHostTable', [UserTable, HostTable]],
        ['TagHostTable', [TagTable, HostTable]],
        ['CategoryTagTable', [CategoryTable, TagTable]],
    ]);

    private static makeKey(a: Function, b: Function): string {
        return [a.name, b.name].sort().join('-');
    }
}
