import { env, seederConfig } from './config/config';
import { AppDataSource } from './db/dataSource';
import { Seeder } from './db/seeding/Seeder';
import { initDbHandler } from './handlers/DbHandler';
import { initLogger } from './core/Logger';
import { ErrorProne } from './types/errors/ErrorProne';
import { startTimer } from './core/Timer';

export async function bootstrap() {
    await AppDataSource.initialize()
        .then(async () => {
            if (env.ENVIRONMENT === 'development') {
                const seeder = new Seeder(seederConfig);
                seeder.seed;
            }
        })
        .catch((error) => console.log(error));

    await initDbHandler();
}

export class Events extends ErrorProne {
    static initCore() {
        startTimer('main');
        initLogger();
    }
}
