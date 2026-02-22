import type { Guild, User } from "discord.js";

import type { RepositoryResolver } from "../core/containers/Repository.js";
import { dependencies } from "../core/Dependencies.js";
import { PermLevel } from "../db/entities/UserHost.js";
import type { HostRepository } from "../db/repositories/HostRepository.js";
import type { UserRepository } from "../db/repositories/UserRepository.js";
import { PermissionDeniedError } from "../errors/client/403.js";

export class PermissionsService {
    private readonly userRepo: UserRepository;
    private readonly hostRepo: HostRepository;

    constructor(repositories: RepositoryResolver = dependencies.repositories) {
        this.userRepo = repositories.userRepo;
        this.hostRepo = repositories.hostRepo;
    }

    async requirePermLevel(user: User, host: Guild, permRequired: PermLevel): Promise<void> {
        const user_db = await this.userRepo.findOrCreateByDiscordId(user.id);

        const host_db = await this.hostRepo.findOrCreateByDiscordId(host.id, host.name);

        const userPerm = await this.userRepo.getPermLevel(user_db, host_db);

        if (userPerm === null) {
            await this.userRepo.createPermLevel(user_db, host_db, PermLevel.DEFAULT);
            if (PermLevel.DEFAULT < permRequired) {
                throw new PermissionDeniedError(permRequired, PermLevel.DEFAULT, user_db);
            }
            return;
        }

        if (userPerm < permRequired) {
            throw new PermissionDeniedError(permRequired, userPerm, user_db);
        }
    }
}
