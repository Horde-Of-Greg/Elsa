import type { Guild, Snowflake } from "discord.js";

import { core } from "../../core/Core";

/**
 * Fetch a Discord Guild object by its ID.
 * @param guildId - The Discord guild ID (snowflake)
 * @returns The Guild object if found, null otherwise
 */
export async function getGuildById(guildId: Snowflake): Promise<Guild | null> {
    try {
        return await core.discord.bot.client.guilds.fetch(guildId);
    } catch (error) {
        return null;
    }
}
