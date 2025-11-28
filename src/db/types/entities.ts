import { CategoryTable } from '../entities/Category';
import { CategoryTagTable } from '../entities/CategoryTag';
import { HostTable } from '../entities/Host';
import { HostAliasTable } from '../entities/HostAlias';
import { TagTable } from '../entities/Tag';
import { TagAliasTable } from '../entities/TagAlias';
import { TagOverridesTable } from '../entities/TagOverrides';
import { TagHostTable } from '../entities/TagHost';
import { UserTable } from '../entities/User';
import { UserHostTable } from '../entities/UserHost';

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
