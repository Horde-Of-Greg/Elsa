import { app } from '../../core/App';

export async function findDcIdByUsername(discordUsername: string): Promise<string | null> {
    const user = await app.discord.dcClient.users.fetch(discordUsername);
    return user?.id ? user.id : null;
}
