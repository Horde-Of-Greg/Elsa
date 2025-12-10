import { app } from './App';
import { env, seederConfig } from '../config/config';
import { Seeder } from '../db/seeding/Seeder';

// Reason: The point of the class here really is just for namespace. It just feels cleaner to use.
 
export class Events {
    static initCore() {
        app.core.startTimer('main');
        app.core.logger.simpleLog('info', 'Core Ready');
    }

    static async initDb() {
        await app.database.dataSource.initialize();
        app.core.logger.simpleLog('success', 'Database initialized');
    }

    static async initBot() {
        await app.discord.bot.login(env.DISCORD_TOKEN);

        app.core.logger.simpleLog('success', 'Bot initialized');
    }

    static async seed() {
        if (env.ENVIRONMENT === 'production') return;
        const seeder = new Seeder(seederConfig);
        await seeder.seed();
    }
}
