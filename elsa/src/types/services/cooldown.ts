import type { Channel, Guild, User } from "discord.js";

import type { CommandParams } from "../commands/command";

export interface CooldownServiceResolver {
    assertCooldownOk(user: User, scope: Guild | Channel, params: CommandParams): Promise<void>;
}
