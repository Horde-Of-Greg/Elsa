import type { Guild, Snowflake } from "discord.js";

import { DiscordGuildNotFound } from "../../errors/client/404";
import type { DiscordBotResolver } from "../../types/discord/bot";

/**
 * Fetch a Discord Guild object by its ID.
 * @param guildId - The Discord guild ID (snowflake)
 * @returns The Guild object if found, null otherwise
 */
export async function getGuildById(guildId: Snowflake, bot: DiscordBotResolver): Promise<Guild> {
    try {
        return await bot.client.guilds.fetch(guildId);
    } catch (error) {
        throw new DiscordGuildNotFound(guildId);
    }
}
