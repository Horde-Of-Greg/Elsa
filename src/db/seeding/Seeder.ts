import { seederConfig } from '../../config/config';
import { SeederConfig } from '../../config/schema';
import { app } from '../../core/App';
import { getGuildById } from '../../utils/discord/guilds';
import { getUserById } from '../../utils/discord/users';
import { sleep } from '../../utils/time';
import { PermLevel } from '../entities/UserHost';

export class Seeder {
    constructor(private readonly config: SeederConfig) {}

    async seed() {
        await this.drop();
        await this.createSudoers();
        app.core.logger.simpleLog('success', 'Seeded Database.');
    }

    private async drop() {
        if (!seederConfig.DROP_DB) return;

        const wait_s = 3;

        app.core.logger.simpleLog(
            'warn',
            `Clearing all data from database in ${3}s. Ctrl + C to stop.`,
        );

        for (let i = 0; i < wait_s; i++) {
            app.core.logger.simpleLog('warn', `${wait_s - i}`);
            await sleep(1000);
        }

        await app.database.dataSource.synchronize(true);

        app.core.logger.simpleLog('success', 'Database cleared.');
    }

    private async createSudoers() {
        const sudoers = seederConfig.SUDOERS.USERS;

        const guild_ids = seederConfig.SUDOERS.GUILDS;
        for (const guild_id of guild_ids) {
            const guild = await getGuildById(guild_id);
            if (!guild) {
                throw new Error('Could not find guild in seeder');
            }

            for (const sudoer of sudoers) {
                const user_dc = await getUserById(sudoer);
                if (!user_dc) {
                    throw new Error(`User with id:${sudoer} not found.`);
                }
                await app.services.userService.createUserWithPerms(user_dc, guild, PermLevel.OWNER);
            }
        }
    }
}
