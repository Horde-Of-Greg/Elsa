import type { Snowflake, User } from "discord.js";

import { core } from "../../core/Core";

/**
 * Fetch a Discord User object by their ID.
 * @param userId - The Discord user ID (snowflake)
 * @returns The User object if found, null otherwise
 */
export async function getUserById(userId: Snowflake): Promise<User | null> {
    try {
        return await core.discord.bot.client.users.fetch(userId);
    } catch (error) {
        return null;
    }
}
