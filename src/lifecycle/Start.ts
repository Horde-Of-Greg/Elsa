import { seederConfig } from "../config/config.js";
import { env } from "../config/env.js";
import { core } from "../core/Core.js";
import { dependencies } from "../core/Dependencies.js";
import { Seeder } from "../db/seeding/Seeder.js";
import { isActionsEnvironment, isProductionEnvironment } from "../utils/node/environment.js";

export const Start = {
    initCore() {
        core.startTimer("main");
        core.logger.info("Core Ready");
    },

    async initCache() {
        await dependencies.cache.client.init();
        core.logger.info("Cache Layer initialized");
    },

    async initDb() {
        if (isActionsEnvironment()) return;
        await dependencies.database.dataSource.initialize();
        core.logger.info("Database initialized");
    },

    async initBot() {
        if (isActionsEnvironment()) return;
        await dependencies.discord.bot.login(env.DISCORD_TOKEN);

        core.logger.info("Bot initialized");
    },

    async seed() {
        if (isProductionEnvironment() || isActionsEnvironment()) return;
        const seeder = new Seeder(seederConfig);
        await seeder.seed();
    },
};
