import type { Guild, User } from "discord.js";

import type { PermLevel } from "../../assets/db/permLevel";
import type { UserTable } from "../../db/entities/User";

export interface UserServiceResolver {
    findOrCreateUser(user_dc: User): Promise<UserTable>;
    createUserWithPerms(user_dc: User, server_dc: Guild, permLevel: PermLevel): Promise<UserTable>;
}
