import { app } from '../core/App';
import { ErrorProne } from '../core/errors/ErrorProne';
import { HostTable } from '../db/entities/Host';
import { UserTable } from '../db/entities/User';
import { PermLevel } from '../db/entities/UserHost';
import { HostRepository } from '../db/repositories/HostRepository';
import { TagRepository } from '../db/repositories/TagRepository';
import { UserRepository } from '../db/repositories/UserRepository';
import { StandardCommand } from '../types/commands/standardCommands';

export class PermissionsService extends ErrorProne {
    tagRepo: TagRepository;
    userRepo: UserRepository;
    hostRepo: HostRepository;

    constructor() {
        super();
        this.tagRepo = app.database.tagRepo;
        this.userRepo = app.database.userRepo;
        this.hostRepo = app.database.hostRepo;
    }

    async requirePermLevel(
        user: UserTable,
        host: HostTable,
        permRequired: PermLevel,
    ): Promise<boolean> {
        const userPerm = await this.userRepo.getPermLevel(user, host);
        if (!userPerm) return false;
        return userPerm >= permRequired;
    }

    async canUseCommand(user: UserTable, host: HostTable, command: StandardCommand) {}
}
