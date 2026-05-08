import { Configs } from "../config/Configs";
import { core } from "../core/Core";
import { dependencies } from "../core/Dependencies";
import { Seeder } from "../db/seeding/Seeder";
import { isActionsEnvironment, isProductionEnvironment } from "../utils/node/environment";

export const Start = {
    Status: {
        core: false,
        cache: false,
        db: false,
        bot: false,
        seeded: false,
    },

    initCore(): void {
        core.startTimer("main");

        this.Status.core = true;
        core.logger.info("Core Ready");
    },

    async initCache(): Promise<void> {
        await dependencies.cache.client.init();

        this.Status.cache = true;
        core.logger.info("Cache Layer initialized");
    },

    async initDb(): Promise<void> {
        if (isActionsEnvironment()) return;
        await dependencies.database.dataSource.initialize();

        this.Status.db = true;
        core.logger.info("Database initialized");
    },

    async initBot(): Promise<void> {
        if (isActionsEnvironment()) return;
        await dependencies.discord.bot.login(Configs.env.DISCORD_TOKEN);

        this.Status.bot = true;
        core.logger.info("Bot initialized");
    },

    async seed(): Promise<void> {
        if (isProductionEnvironment() || isActionsEnvironment()) return;
        const seeder = new Seeder(Configs.seeder);
        await seeder.seed();

        this.Status.seeded = true;
    },
};
