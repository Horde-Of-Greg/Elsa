import type { SeederConfig } from "../../config/schemas/seeder.schema";
import { core } from "../../core/Core";
import { dependencies } from "../../core/Dependencies";
import { getGuildById } from "../../utils/discord/guilds";
import { getUserById } from "../../utils/discord/users";
import { sleep } from "../../utils/time";
import { PermLevel } from "../entities/UserHost";

export class Seeder {
    constructor(private readonly seederConfig: SeederConfig) {}

    async seed(): Promise<void> {
        await this.drop();
        await this.createSudoers();
        core.logger.info("Seeded Database.");
    }

    private async drop(): Promise<void> {
        if (!this.seederConfig.DROP_DB) return;

        const wait_s = 3;

        core.logger.warnUser(
            `Clearing all data from database ${this.seederConfig.WAIT_TO_DROP_DB ? `in ${wait_s.toString()}s. Ctrl + C to stop.` : ""}`,
        );

        if (this.seederConfig.WAIT_TO_DROP_DB) {
            for (let i = 0; i < wait_s; i++) {
                core.logger.warnUser((wait_s - i).toString());
                await sleep(1000);
            }
        }

        await dependencies.database.dataSource.synchronize(true);

        core.logger.info("Database cleared.");
    }

    private async createSudoers(): Promise<void> {
        const sudoers = this.seederConfig.SUDOERS.USERS;

        const guild_ids = this.seederConfig.SUDOERS.GUILDS;
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
