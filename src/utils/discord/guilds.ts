import type { Guild, Snowflake } from "discord.js";

import { dependencies } from "../../core/Dependencies";
import { GuildNotFoundError } from "../../errors/internal/discord";

/**
 * Fetch a Discord Guild object by its ID.
 * @param guildId - The Discord guild ID (snowflake)
 * @returns The Guild object if found, null otherwise
 */
export async function getGuildById(guildId: Snowflake): Promise<Guild> {
    try {
        return await dependencies.discord.bot.client.guilds.fetch(guildId);
    } catch (error) {
        throw new GuildNotFoundError(guildId);
    }
}
