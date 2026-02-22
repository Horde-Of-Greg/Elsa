import type { RepositoryResolver } from "../core/containers/Repository.js";
import { dependencies } from "../core/Dependencies.js";
import type { HostRepository } from "../db/repositories/HostRepository.js";

export class HostService {
    private hostRepo: HostRepository;

    constructor(repositories: RepositoryResolver = dependencies.repositories) {
        this.hostRepo = repositories.hostRepo;
    }

    async findOrCreateHost(hostDId: string, hostName: string) {
        return this.hostRepo.findOrCreateByDiscordId(hostDId, hostName);
    }
}
