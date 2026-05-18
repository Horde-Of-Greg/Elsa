import type { Guild, User } from "discord.js";

import type { TagTable } from "../../db/entities/Tag";
import type { UserTable } from "../../db/entities/User";
import type { SHA256Hash } from "../crypto";

export interface TagServiceResolver {
    createTag(context: CreateTagContext): Promise<TagTable>;

    createAlias(
        aliasName: string,
        context: { tagToAlias: string; type: "literal" } | { tagToAlias: TagTable; type: "object" },
        aliasAuthor: UserTable,
    ): Promise<TagTable>;

    updateTag(context: { tagName: string; tagBody: string; tagBodyHash: SHA256Hash }): Promise<TagTable>;
    deleteTag(tagName?: string, tag?: TagTable): Promise<void>;
    retrieveTag(tagName: string): Promise<TagTable>;
    tagExists(name: string): Promise<boolean>;

    tagBodyExists(
        body: string,
    ): Promise<{ exists: true; tagWithBody: TagTable } | { exists: false; hash: SHA256Hash }>;

    findTag(name: string): Promise<TagTable | null>;
    findTagStrict(name: string): Promise<TagTable | null>;
}

export type CreateTagContext = {
    tagName: string;
    tagBody: string;
    tagBodyHash: SHA256Hash;
    author: User;
    guild: Guild;
};
