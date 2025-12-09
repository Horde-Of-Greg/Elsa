import { Guild, User } from 'discord.js';
import { app } from '../core/App';
import { HostTable } from '../db/entities/Host';
import { UserTable } from '../db/entities/User';
import { PermLevel } from '../db/entities/UserHost';
import { HostRepository } from '../db/repositories/HostRepository';
import { TagRepository } from '../db/repositories/TagRepository';
import { UserRepository } from '../db/repositories/UserRepository';
import { UserNotFoundError } from '../core/errors/internal/services';
import { PermissionDeniedError } from '../core/errors/client/403';

export class PermissionsService {
    private tagRepo: TagRepository;
    private userRepo: UserRepository;
    private hostRepo: HostRepository;

    constructor() {
        this.tagRepo = app.database.tagRepo;
        this.userRepo = app.database.userRepo;
        this.hostRepo = app.database.hostRepo;
    }

    async requirePermLevel(user: User, host: Guild, permRequired: PermLevel): Promise<void> {
        const user_db = await this.userRepo.findByDiscordId(user.id);

        if (!user_db) {
            throw new UserNotFoundError(user.id);
        }

        const host_db = await this.hostRepo.findOrCreateByDiscordId(host.id, host.name);

        const userPerm = await this.userRepo.getPermLevel(user_db, host_db);

        if (userPerm == null) {
            throw new PermissionDeniedError(permRequired, null);
            //Separate these if statements in case we want to handle errors differently.
        }

        if (userPerm < permRequired) {
            throw new PermissionDeniedError(permRequired, userPerm);
        }
    }
}
