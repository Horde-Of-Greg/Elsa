import type { HostTable } from "../../db/entities/Host.js";
import type { TagHostStatus } from "../../db/entities/TagHost.js";
import type { UserTable } from "../../db/entities/User.js";
import type { SHA256Hash } from "../crypto.js";

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
