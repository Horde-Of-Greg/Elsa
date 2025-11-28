import { env, seederConfig } from './config/config';
import { AppDataSource } from './db/dataSource';
import { Seeder } from './db/seeding/Seeder';
import { initDbHandler } from './handlers/DbHandler';
import { initLogger } from './utils/Logger';
import { ErrorProne } from './utils/parentClasses/ErrorProne';
import { startTimer } from './utils/Timer';

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
    static initEssentials() {
        startTimer('main');
        initLogger();
    }
}
