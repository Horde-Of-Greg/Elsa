import type { RepositoryResolver } from "../core/containers/Repository";
import { dependencies } from "../core/Dependencies";
import type { HostRepository } from "../db/repositories/HostRepository";

export class HostService {
    private readonly hostRepo: HostRepository;

    constructor(repositories: RepositoryResolver = dependencies.repositories) {
        this.hostRepo = repositories.hostRepo;
    }

    async findOrCreateHost(hostDId: string, hostName: string) {
        return this.hostRepo.findOrCreateByDiscordId(hostDId, hostName);
    }
}
