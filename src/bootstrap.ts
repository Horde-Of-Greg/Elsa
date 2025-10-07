import { env, seederConfig } from './config/config';
import { AppDataSource } from './db/dataSource';
import { Seeder } from './db/seeding/Seeder';

export async function bootstrap() {
    AppDataSource.initialize()
        .then(async () => {
            if (env.ENVIRONMENT === 'development') {
                const seeder = new Seeder(seederConfig);
                await seeder.seed;
            }
        })
        .catch((error) => console.log(error));
}
