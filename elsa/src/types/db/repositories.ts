import type { Snowflake } from "discord.js";

import type { PermLevel } from "../../assets/db/permLevel";
import type { CategoryTable } from "../../db/entities/Category";
import type { HostTable } from "../../db/entities/Host";
import type { TagTable } from "../../db/entities/Tag";
import type { TagHostStatus } from "../../db/entities/TagHost";
import type { TagOverridesTable } from "../../db/entities/TagOverrides";
import type { UserTable } from "../../db/entities/User";
import type { SHA256Hash } from "../crypto";

export type TagElements = {
    name: string;
    body: string;
    bodyHash: SHA256Hash;
    author: UserTable;
};

export type TagHostElements = {
    host: HostTable;
    status?: TagHostStatus;
};

export interface HostRepositoryResolver {
    findByDiscordId(discordId: string): Promise<HostTable | null>;
    findByName(name: string): Promise<HostTable | null>;
    findOrCreateByDiscordId(discordId: string, name: string): Promise<HostTable>;
}

export interface TagOverridesRepositoryResolver {
    findOverride(tag: TagTable, host: HostTable): Promise<TagOverridesTable | null>;
    findAllByTag(tag: TagTable): Promise<TagOverridesTable[]>;
    findAllByHost(host: HostTable): Promise<TagOverridesTable[]>;
}

export interface TagRepositoryResolver {
    createTag(elements: TagElements): TagTable;
    createManyTags(elements: TagElements[]): TagTable[];

    saveTag(tag: TagTable, elements: TagHostElements): Promise<TagTable>;
    saveManyTags(elements: Map<TagTable, TagHostElements>): Promise<TagTable[]>;

    createAndSaveTag(elements: TagElements, statusOnHost: TagHostElements): Promise<TagTable>;
    createAndSaveManyTags(elements: Map<TagElements, TagHostElements>): Promise<TagTable[]>;
    createAlias(aliasName: string, tagToAlias: TagTable, aliasAuthor: UserTable): Promise<TagTable>;

    findAllByAuthor(author: UserTable): Promise<TagTable[]>;
    findAllByAuthorName(authorName: string): Promise<TagTable[] | null>;
    findAllByAuthorDId(authorDId: string): Promise<TagTable[] | null>;
    findAllByHost(host: HostTable, status?: TagHostStatus): Promise<TagTable[]>;
    findAllByHostName(hostName: string, status?: TagHostStatus): Promise<TagTable[] | null>;
    findAllByCategory(category: CategoryTable): Promise<TagTable[]>;
    findAllByCategoryName(categoryName: string): Promise<TagTable[] | null>;
    findByName(name: string): Promise<TagTable | null>;
    findByAlias(aliasName: string): Promise<TagTable | null>;
    findByNameOrAlias(nameOrAlias: string): Promise<TagTable | null>;
    findWithRelations(id: number): Promise<TagTable | null>;
    findByHash(hash: SHA256Hash): Promise<TagTable | null>;

    hashExists(hash: SHA256Hash): Promise<boolean>;
    tagExistsByName(name: string): Promise<boolean>;

    forceUpdateOne(tag: TagTable): Promise<TagTable>;
    forceUpdateMany(tags: TagTable[]): Promise<TagTable[]>;

    banTagOnHost(tag: TagTable, host: HostTable): Promise<TagTable | null>;
    banManyTagsOnHost(tags: TagTable[], host: HostTable): Promise<TagTable[]>;

    deleteTag(tag: TagTable): Promise<void>;
}

export interface UserRepositoryResolver {
    findByDiscordId(discordId: string): Promise<UserTable | null>;
    findOrCreateByDiscordId(discordId: Snowflake, name?: string): Promise<UserTable>;

    createPermLevel(
        user: UserTable,
        host: HostTable,
        permLevel: PermLevel,
    ): Promise<{ user: UserTable; perm: PermLevel }>;

    updateOrCreatePermLevel(
        user: UserTable,
        host: HostTable,
        permLevel: PermLevel,
    ): Promise<{ user: UserTable; perm: PermLevel }>;

    getPermLevel(user: UserTable, host: HostTable): Promise<PermLevel | null>;
}
