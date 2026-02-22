import type { HostTable } from "../../db/entities/Host";
import type { TagHostStatus } from "../../db/entities/TagHost";
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
