import type { Snowflake, User } from "discord.js";

import { dependencies } from "../../core/Dependencies";

/**
 * Fetch a Discord User object by their ID.
 * @param userId - The Discord user ID (snowflake)
 * @returns The User object if found, null otherwise
 */
export async function getUserById(userId: Snowflake): Promise<User | null> {
    try {
        return await dependencies.discord.bot.client.users.fetch(userId);
    } catch (error) {
        return null;
    }
}
