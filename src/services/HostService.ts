import { Snowflake } from 'discord.js';
import { app } from '../core/App';
import { HostRepository } from '../db/repositories/HostRepository';
import { TagRepository } from '../db/repositories/TagRepository';
import { UserRepository } from '../db/repositories/UserRepository';

export class HostService {
    private tagRepo: TagRepository;
    private userRepo: UserRepository;
    private hostRepo: HostRepository;

    constructor() {
        this.tagRepo = app.database.tagRepo;
        this.userRepo = app.database.userRepo;
        this.hostRepo = app.database.hostRepo;
    }

    async findOrCreateHost(hostDId: string, hostName: string) {
        return this.hostRepo.findOrCreateByDiscordId(hostDId, hostName);
    }
}
