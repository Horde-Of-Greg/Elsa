import type { Snowflake, User } from "discord.js";

import { DiscordUserNotFound } from "../../errors/client/404";
import type { DiscordBotResolver } from "../../types/discord/bot";

/**
 * Fetch a Discord User object by their ID.
 * @param userId - The Discord user ID (snowflake)
 * @returns The User object if found, null otherwise
 */
export async function getUserById(userId: Snowflake, bot: DiscordBotResolver): Promise<User> {
    try {
        return await bot.client.users.fetch(userId);
    } catch (error) {
        throw new DiscordUserNotFound({ type: "user id", value: userId });
    }
}
