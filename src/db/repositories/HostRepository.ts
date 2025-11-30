import { BaseRepository } from './BaseRepository';
import { HostTable } from '../entities/Host';
import { TagHostStatus, TagHostTable } from '../entities/TagHost';

export class HostRepository extends BaseRepository<HostTable> {
    constructor() {
        super(HostTable);
    }

    async findByDiscordId(discordId: string): Promise<HostTable | null> {
        return this.findOne({ discordId });
    }

    async findByName(name: string): Promise<HostTable | null> {
        return this.findOne({ name });
    }
}
