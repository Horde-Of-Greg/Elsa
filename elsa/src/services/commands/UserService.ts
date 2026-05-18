import type { Guild, User } from "discord.js";

import type { PermLevel } from "../../assets/db/permLevel";
import type { UserTable } from "../../db/entities/User";
import type { RepositoryContainerResolver, ServicesContainerResolver } from "../../types/core/containers";
import type { UserRepositoryResolver } from "../../types/db/repositories";
import type { HostServiceResolver } from "../../types/services/host";
import type { UserServiceResolver } from "../../types/services/user";

export class UserService implements UserServiceResolver {
    private readonly userRepo: UserRepositoryResolver;
    private readonly hostService: HostServiceResolver;

    constructor(repositories: RepositoryContainerResolver, services: ServicesContainerResolver) {
        this.userRepo = repositories.userRepo;
        this.hostService = services.hostService;
    }

    async findOrCreateUser(user_dc: User): Promise<UserTable> {
        return this.userRepo.findOrCreateByDiscordId(user_dc.id, user_dc.username);
    }

    async createUserWithPerms(user_dc: User, server_dc: Guild, permLevel: PermLevel): Promise<UserTable> {
        const user = await this.findOrCreateUser(user_dc);
        const host = await this.hostService.findOrCreateHost(server_dc.id, server_dc.name);
        return (await this.userRepo.updateOrCreatePermLevel(user, host, permLevel)).user;
    }
}
