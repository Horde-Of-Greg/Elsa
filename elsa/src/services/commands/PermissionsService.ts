import type { Guild, User } from "discord.js";

import { PermLevel } from "../../assets/db/permLevel";
import { PermissionDeniedError } from "../../errors/client/403";
import type { ConfigsResolver } from "../../types/config/config";
import type { RepositoryContainerResolver } from "../../types/core/containers";
import type { HostRepositoryResolver, UserRepositoryResolver } from "../../types/db/repositories";
import type { PermissionsServiceResolver } from "../../types/services/permissions";

export class PermissionsService implements PermissionsServiceResolver {
    private readonly userRepo: UserRepositoryResolver;
    private readonly hostRepo: HostRepositoryResolver;

    constructor(
        repositories: RepositoryContainerResolver,
        private readonly configs: ConfigsResolver,
    ) {
        this.userRepo = repositories.userRepo;
        this.hostRepo = repositories.hostRepo;
    }

    async requirePermLevel(user: User, host: Guild, permRequired: PermLevel): Promise<void> {
        const user_db = await this.userRepo.findOrCreateByDiscordId(user.id);
        const host_db = await this.hostRepo.findOrCreateByDiscordId(host.id, host.name);
        let userPerm = await this.userRepo.getPermLevel(user_db, host_db);

        userPerm ??= (await this.userRepo.createPermLevel(user_db, host_db, PermLevel.DEFAULT)).perm;

        if (userPerm < permRequired) {
            throw new PermissionDeniedError(permRequired, userPerm, user_db, this.configs);
        }
    }
}
