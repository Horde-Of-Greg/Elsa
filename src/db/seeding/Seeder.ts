import { seederConfig } from "../../config/config.js";
import type { SeederConfig } from "../../config/schema.js";
import { core } from "../../core/Core.js";
import { dependencies } from "../../core/Dependencies.js";
import { getGuildById } from "../../utils/discord/guilds.js";
import { getUserById } from "../../utils/discord/users.js";
import { sleep } from "../../utils/time.js";
import { PermLevel } from "../entities/UserHost.js";

export class Seeder {
    constructor(private readonly appConfig: SeederConfig) {}

    async seed() {
        await this.drop();
        await this.createSudoers();
        core.logger.info("Seeded Database.");
    }

    private async drop() {
        if (!this.appConfig.DROP_DB) return;

        const wait_s = 3;

        core.logger.warnUser(
            `Clearing all data from database ${seederConfig.WAIT_TO_DROP_DB ? `in ${wait_s.toString()}s. Ctrl + C to stop.` : ""}`,
        );

        if (seederConfig.WAIT_TO_DROP_DB) {
            for (let i = 0; i < wait_s; i++) {
                core.logger.warnUser((wait_s - i).toString());
                await sleep(1000);
            }
        }

        await dependencies.database.dataSource.synchronize(true);

        core.logger.info("Database cleared.");
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
                await dependencies.services.userService.createUserWithPerms(user_dc, guild, PermLevel.OWNER);
            }
        }
    }
}
