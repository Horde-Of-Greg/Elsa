import type { CategoryTable } from '../entities/Category';
import type { CategoryTagTable } from '../entities/CategoryTag';
import type { HostTable } from '../entities/Host';
import type { HostAliasTable } from '../entities/HostAlias';
import type { TagTable } from '../entities/Tag';
import type { TagAliasTable } from '../entities/TagAlias';
import type { TagOverridesTable } from '../entities/TagOverrides';
import type { TagHostTable } from '../entities/TagHost';
import type { UserTable } from '../entities/User';
import type { UserHostTable } from '../entities/UserHost';

export type ValidEntity =
    | CategoryTable
    | CategoryTagTable
    | HostTable
    | HostAliasTable
    | TagTable
    | TagAliasTable
    | TagOverridesTable
    | TagHostTable
    | UserTable
    | UserHostTable;
