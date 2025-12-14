import { HostTable } from "../entities/Host";
import { BaseRepository } from "./BaseRepository";

export class HostRepository extends BaseRepository<HostTable> {
    constructor() {
        super(HostTable);
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
