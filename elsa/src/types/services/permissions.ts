import type { Guild, User } from "discord.js";

import type { PermLevel } from "../../assets/db/permLevel";

export interface PermissionsServiceResolver {
    requirePermLevel(user: User, host: Guild, permRequired: PermLevel): Promise<void>;
}
