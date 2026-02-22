import type { Snowflake } from "discord.js";

import type { HostTable } from "../entities/Host.js";
import { UserTable } from "../entities/User.js";
import { type PermLevel, UserHostTable } from "../entities/UserHost.js";
import { BaseRepository } from "../repositories/BaseRepository.js";

export class UserRepository extends BaseRepository<UserTable> {
    constructor() {
        super(UserTable);
    }

    async findByDiscordId(discordId: string): Promise<UserTable | null> {
        return this.findOne({ discordId });
    }

    async findOrCreateByDiscordId(discordId: Snowflake, name?: string): Promise<UserTable> {
        let user = await this.findByDiscordId(discordId);
        if (!user) {
            user = this.create({
                discordId,
                name,
            });
            await this.save(user);
        }
        return user;
    }

    async getPermLevel(user: UserTable, host: HostTable): Promise<PermLevel | null> {
        const userHost = await this.findOneByJoin(UserHostTable, user, host);
        return userHost?.permLevel ?? null;
    }

    async createPermLevel(user: UserTable, host: HostTable, permLevel: PermLevel) {
        await this.createAndSaveOnOtherTable(UserHostTable, {
            userId: user.id,
            hostId: host.id,
            permLevel,
        });
    }

    async updateOrCreatePermLevel(user: UserTable, host: HostTable, permLevel: PermLevel) {
        const existingUserHost = await this.findOneByJoin(UserHostTable, user, host);

        if (existingUserHost) {
            existingUserHost.permLevel = permLevel;
            await this.saveOnOtherTable(existingUserHost);
        } else {
            await this.createPermLevel(user, host, permLevel);
        }
    }
}
