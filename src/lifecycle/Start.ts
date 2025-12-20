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

    async initDb() {
        if (env.ENVIRONMENT === "actions") return;
        await dependencies.database.dataSource.initialize();
        core.logger.info("Database initialized");
    },

    async initBot() {
        if (env.ENVIRONMENT === "actions") return;
        await dependencies.discord.bot.login(env.DISCORD_TOKEN);

        core.logger.info("Bot initialized");
    },

    async seed() {
        if (env.ENVIRONMENT === "production" || env.ENVIRONMENT === "actions") return;
        const seeder = new Seeder(seederConfig);
        await seeder.seed();
    },
};
