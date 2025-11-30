import { User } from 'discord.js';
import { getBotClient, getDcClient } from '../../client/BotClient';

export async function findDcIdByUsername(discordUsername: string): Promise<string | null> {
    const user = await getDcClient().users.fetch(discordUsername);
    return user?.id ? user.id : null;
}
