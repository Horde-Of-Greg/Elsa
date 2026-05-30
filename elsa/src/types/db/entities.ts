import type { CategoryTable } from "../../db/entities/Category";
import type { CategoryTagTable } from "../../db/entities/CategoryTag";
import type { HostTable } from "../../db/entities/Host";
import type { HostAliasTable } from "../../db/entities/HostAlias";
import type { TagTable } from "../../db/entities/Tag";
import type { TagAliasTable } from "../../db/entities/TagAlias";
import type { TagHostTable } from "../../db/entities/TagHost";
import type { TagOverridesTable } from "../../db/entities/TagOverrides";
import type { UserTable } from "../../db/entities/User";
import type { UserHostTable } from "../../db/entities/UserHost";

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
