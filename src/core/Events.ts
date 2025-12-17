import { seederConfig } from "../config/config";
import { env } from "../config/env";
import { Seeder } from "../db/seeding/Seeder";
import { core } from "./Core";
import { dependencies } from "./Dependencies";

export const Events = {
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
