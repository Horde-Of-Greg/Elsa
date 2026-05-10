import type { Snowflake, User } from "discord.js";

import { dependencies } from "../../core/Dependencies";
import { DiscordUserNotFound } from "../../errors/client/404";

/**
 * Fetch a Discord User object by their ID.
 * @param userId - The Discord user ID (snowflake)
 * @returns The User object if found, null otherwise
 */
export async function getUserById(userId: Snowflake): Promise<User> {
    try {
        return await dependencies.discord.bot.client.users.fetch(userId);
    } catch (error) {
        throw new DiscordUserNotFound({ type: "user id", value: userId });
    }
}
