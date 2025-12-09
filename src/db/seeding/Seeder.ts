import { SeederConfig } from '../../config/schema';
import { app } from '../../core/App';
import { sleep } from '../../utils/time';

export class Seeder {
    constructor(private readonly config: SeederConfig) {}

    async seed() {
        await this.drop();
    }

    private async drop() {
        const wait_s = 3;
        app.core.logger.simpleLog(
            'warn',
            `Clearing all data from database in ${3}s. Ctrl + C to stop.`,
        );

        for (let i = 0; i < wait_s; i++) {
            app.core.logger.simpleLog('warn', `${wait_s - i}`);
            await sleep(1000);
        }

        await app.database.dataSource.synchronize(true);

        app.core.logger.simpleLog('success', 'Database cleared.');
    }
}
