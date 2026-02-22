import type { Guild, User } from "discord.js";

import type { RepositoryResolver } from "../core/containers/Repository.js";
import type { ServicesResolver } from "../core/containers/Services.js";
import { dependencies } from "../core/Dependencies.js";
import type { PermLevel } from "../db/entities/UserHost.js";
import type { UserRepository } from "../db/repositories/UserRepository.js";
import type { HostService } from "./HostService.js";

export class UserService {
    private readonly userRepo: UserRepository;
    private readonly hostService: HostService;

    constructor(
        repositories: RepositoryResolver = dependencies.repositories,
        services: ServicesResolver = dependencies.services,
    ) {
        this.userRepo = repositories.userRepo;
        this.hostService = services.hostService;
    }

    async findOrCreateUser(user_dc: User) {
        return this.userRepo.findOrCreateByDiscordId(user_dc.id, user_dc.username);
    }

    async createUserWithPerms(user_dc: User, server_dc: Guild, permLevel: PermLevel) {
        const user = await this.findOrCreateUser(user_dc);
        const host = await this.hostService.findOrCreateHost(server_dc.id, server_dc.name);
        return this.userRepo.updateOrCreatePermLevel(user, host, permLevel);
    }
}
