import { seederConfig } from "../config/config";
import { env } from "../config/env";
import { core } from "../core/Core";
import { dependencies } from "../core/Dependencies";
import { Seeder } from "../db/seeding/Seeder";

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
        if (process.env.NODE_ENV === "actions") return;
        await dependencies.database.dataSource.initialize();
        core.logger.info("Database initialized");
    },

    async initBot() {
        if (process.env.NODE_ENV === "actions") return;
        await dependencies.discord.bot.login(env.DISCORD_TOKEN);

        core.logger.info("Bot initialized");
    },

    async seed() {
        if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "actions") return;
        const seeder = new Seeder(seederConfig);
        await seeder.seed();
    },
};
