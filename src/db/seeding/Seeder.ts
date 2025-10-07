import { SeederConfig } from '../../config/schema';

export class Seeder {
    constructor(private readonly config: SeederConfig) {}

    async seed() {
        console.log('seeder empty for now');
    }
}
