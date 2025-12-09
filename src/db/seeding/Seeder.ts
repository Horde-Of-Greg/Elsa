import { SeederConfig } from '../../config/schema';
import { app } from '../../core/App';

export class Seeder {
    constructor(private readonly config: SeederConfig) {}

    async seed() {
        app.core.logger.simpleLog('warn', 'Seeder Empty.');
    }
}
