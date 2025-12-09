import { app } from './App';
import { env, seederConfig } from '../config/config';
import { Seeder } from '../db/seeding/Seeder';

export class Events {
    static initCore() {
        app.core.startTimer('main');
        app.core.logger.simpleLog('info', 'Core Ready');
    }

    static async initDb() {
        await app.database.dataSource
            .initialize()
            .then(async () => {
                if (env.ENVIRONMENT === 'development') {
                    const seeder = new Seeder(seederConfig);
                    seeder.seed();
                }
            })
            .catch((error) => console.log(error));

        app.core.logger.simpleLog('success', 'Database initialized');
    }

    static initBot() {
        app.discord.bot.login(env.DISCORD_TOKEN);
        app.core.logger.simpleLog('success', 'Bot initialized');
    }
}
