import type { User, Guild } from 'discord.js';
import { app } from '../core/App';
import type { PermLevel } from '../db/entities/UserHost';
import type { UserRepository } from '../db/repositories/UserRepository';

export class UserService {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = app.database.userRepo;
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
