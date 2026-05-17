import type { DatabaseContainerResolver } from "../../types/core/containers";
import type { HostRepositoryResolver } from "../../types/db/repositories";
import { HostTable } from "../entities/Host";
import { BaseRepository } from "./BaseRepository";

export class HostRepository extends BaseRepository<HostTable> implements HostRepositoryResolver {
    constructor(databaseContainer: DatabaseContainerResolver) {
        super(HostTable, databaseContainer);
    }

    async findByDiscordId(discordId: string): Promise<HostTable | null> {
        return this.findOne({ discordId });
    }

    async findByName(name: string): Promise<HostTable | null> {
        return this.findOne({ name });
    }

    async findOrCreateByDiscordId(discordId: string, name: string): Promise<HostTable> {
        let host = await this.findByDiscordId(discordId);

        if (!host) {
            host = this.create({ discordId, name });
            await this.save(host);
        }

        return host;
    }
}
