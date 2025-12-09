import { Snowflake, User, Guild } from 'discord.js';
import { app } from '../core/App';
import { HostTable } from '../db/entities/Host';
import { UserTable } from '../db/entities/User';
import { PermLevel } from '../db/entities/UserHost';
import { HostRepository } from '../db/repositories/HostRepository';
import { TagRepository } from '../db/repositories/TagRepository';
import { UserRepository } from '../db/repositories/UserRepository';

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
