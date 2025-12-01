import { app } from './App';
import { env, seederConfig } from '../config/config';
import { Seeder } from '../db/seeding/Seeder';
import { ErrorProne } from './errors/ErrorProne';

export class Events extends ErrorProne {
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
                    seeder.seed;
                }
            })
            .catch((error) => console.log(error));

        app.database.dbHandler;
        app.core.logger.simpleLog('success', 'Database initialized');
    }

    static initBot() {
        const botClient = app.discord.botClient;
        const dcClient = app.discord.dcClient;
        const eventHandler = app.discord.eventHandler;

        dcClient.once('clientReady', () => eventHandler.onReady());
        dcClient.on('messageCreate', (m) => void eventHandler.onMessageCreate(m));

        dcClient.login(env.DISCORD_TOKEN);

        app.core.logger.simpleLog('success', 'Bot initialized');
    }
}
