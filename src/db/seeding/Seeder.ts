import type { SeederConfig } from "../../config/schema";
import { app } from "../../core/App";
import { getGuildById } from "../../utils/discord/guilds";
import { getUserById } from "../../utils/discord/users";
import { sleep } from "../../utils/time";
import { PermLevel } from "../entities/UserHost";

export class Seeder {
    constructor(private readonly appConfig: SeederConfig) {}

    async seed() {
        await this.drop();
        await this.createSudoers();
        app.core.logger.info("Seeded Database.");
    }

    private async drop() {
        if (!this.appConfig.DROP_DB) return;

        const wait_s = 3;

        app.core.logger.warnUser(
            `Clearing all data from database in ${wait_s.toString()}s. Ctrl + C to stop.`,
        );

        for (let i = 0; i < wait_s; i++) {
            app.core.logger.warnUser((wait_s - i).toString());
            await sleep(1000);
        }

        await app.database.dataSource.synchronize(true);

        app.core.logger.info("Database cleared.");
    }

    private async createSudoers() {
        const sudoers = this.appConfig.SUDOERS.USERS;

        const guild_ids = this.appConfig.SUDOERS.GUILDS;
        for (const guild_id of guild_ids) {
            const guild = await getGuildById(guild_id);
            if (!guild) {
                throw new Error("Could not find guild in seeder");
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
