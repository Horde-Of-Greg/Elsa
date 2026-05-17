import type { HostTable } from "../../db/entities/Host";
import type { RepositoryContainerResolver } from "../../types/core/containers";
import type { HostRepositoryResolver } from "../../types/db/repositories";
import type { HostServiceResolver } from "../../types/services/host";

export class HostService implements HostServiceResolver {
    private readonly hostRepo: HostRepositoryResolver;

    constructor(repositories: RepositoryContainerResolver) {
        this.hostRepo = repositories.hostRepo;
    }

    async findOrCreateHost(hostDId: string, hostName: string): Promise<HostTable> {
        return this.hostRepo.findOrCreateByDiscordId(hostDId, hostName);
    }
}
