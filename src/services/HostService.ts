import { app } from '../core/App';
import type { HostRepository } from '../db/repositories/HostRepository';

export class HostService {
    private hostRepo: HostRepository;

    constructor() {
        this.hostRepo = app.database.hostRepo;
    }

    async findOrCreateHost(hostDId: string, hostName: string) {
        return this.hostRepo.findOrCreateByDiscordId(hostDId, hostName);
    }
}
