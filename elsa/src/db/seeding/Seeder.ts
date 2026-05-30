import { PermLevel } from "../../assets/db/permLevel";
import type { Dependencies } from "../../core/Dependencies";
import { getGuildById } from "../../utils/discord/guilds";
import { getUserById } from "../../utils/discord/users";
import { sleep } from "../../utils/time";

export class Seeder {
    constructor(private readonly dependencies: Dependencies) {}

    async seed(): Promise<void> {
        await this.drop();
        await this.createSudoers();
        this.dependencies.logger.info("Seeded Database.");
    }

    private async drop(): Promise<void> {
        if (!this.dependencies.configs.seeder.DROP_DB) return;

        const wait_s = 3;

        this.dependencies.logger.warnUser(
            `Clearing all data from database ${this.dependencies.configs.seeder.WAIT_TO_DROP_DB ? `in ${wait_s.toString()}s. Ctrl + C to stop.` : ""}`,
        );

        if (this.dependencies.configs.seeder.WAIT_TO_DROP_DB) {
            for (let i = 0; i < wait_s; i++) {
                this.dependencies.logger.warnUser((wait_s - i).toString());
                await sleep(1000);
            }
        }

        await this.dependencies.database.dataSource.synchronize(true);

        this.dependencies.logger.info("Database cleared.");
    }

    private async createSudoers(): Promise<void> {
        const sudoers = this.dependencies.configs.seeder.SUDOERS.USERS;

        const guild_ids = this.dependencies.configs.seeder.SUDOERS.GUILDS;
        for (const guild_id of guild_ids) {
            const guild = await getGuildById(guild_id, this.dependencies.discord.bot);

            for (const sudoer of sudoers) {
                const user_dc = await getUserById(sudoer, this.dependencies.discord.bot);
                await this.dependencies.services.userService.createUserWithPerms(
                    user_dc,
                    guild,
                    PermLevel.OWNER,
                );
            }
        }
    }
}
