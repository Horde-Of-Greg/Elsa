import type { CategoryTable } from "../../db/entities/Category.js";
import type { CategoryTagTable } from "../../db/entities/CategoryTag.js";
import type { HostTable } from "../../db/entities/Host.js";
import type { HostAliasTable } from "../../db/entities/HostAlias.js";
import type { TagTable } from "../../db/entities/Tag.js";
import type { TagAliasTable } from "../../db/entities/TagAlias.js";
import type { TagHostTable } from "../../db/entities/TagHost.js";
import type { TagOverridesTable } from "../../db/entities/TagOverrides.js";
import type { UserTable } from "../../db/entities/User.js";
import type { UserHostTable } from "../../db/entities/UserHost.js";

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
