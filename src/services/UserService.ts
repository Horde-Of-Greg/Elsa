import type { User, Guild } from 'discord.js';
import { app } from '../core/App';
import type { PermLevel } from '../db/entities/UserHost';
import type { HostRepository } from '../db/repositories/HostRepository';
import type { TagRepository } from '../db/repositories/TagRepository';
import type { UserRepository } from '../db/repositories/UserRepository';

export class UserService {
    private tagRepo: TagRepository;
    private userRepo: UserRepository;
    private hostRepo: HostRepository;

    constructor() {
        this.tagRepo = app.database.tagRepo;
        this.userRepo = app.database.userRepo;
        this.hostRepo = app.database.hostRepo;
    }

    async findOrCreateUser(user_dc: User) {
        return this.userRepo.findOrCreateByDiscordId(user_dc.id, user_dc.username);
    }

    async createUserWithPerms(user_dc: User, server_dc: Guild, permLevel: PermLevel) {
        const user = await this.findOrCreateUser(user_dc);
        const host = await app.services.hostService.findOrCreateHost(server_dc.id, server_dc.name);
        return this.userRepo.createPermLevel(user, host, permLevel);
    }
}
