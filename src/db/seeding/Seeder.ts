import { SeedOptions } from './types';
export class Seeder {
    constructor(private readonly config: SeedOptions) {}

    async seed() {
        console.log('seeder empty for now');
    }
}
