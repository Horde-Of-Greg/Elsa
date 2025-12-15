import { env, seederConfig } from "../config/appConfig";
import { Seeder } from "../db/seeding/Seeder";
import { app } from "./App";

export const Events = {
    initCore() {
        app.core.startTimer("main");
        app.core.logger.info("Core Ready");
    },

    async initDb() {
        if (env.ENVIRONMENT === "actions") return;
        await app.database.dataSource.initialize();
        app.core.logger.info("Database initialized");
    },

    async initBot() {
        if (env.ENVIRONMENT === "actions") return;
        await app.discord.bot.login(env.DISCORD_TOKEN);

        app.core.logger.info("Bot initialized");
    },

    async seed() {
        if (env.ENVIRONMENT === "production" || env.ENVIRONMENT === "actions") return;
        const seeder = new Seeder(seederConfig);
        await seeder.seed();
    },
};
